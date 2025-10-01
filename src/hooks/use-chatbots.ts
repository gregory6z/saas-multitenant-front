import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiWithTenant } from "@/lib/api-with-tenant";
import { useCurrentTenant } from "@/hooks/use-current-tenant";

// Chatbot schemas
const ChatbotSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "draft"]),
  created_at: z.string(),
  updated_at: z.string(),
  tenant_id: z.string(),
  message_count: z.number().default(0),
  storage_used: z.number().default(0), // in MB
  is_public: z.boolean().default(false),
  avatar_url: z.string().nullable().optional(),
  model: z.string().default("gpt-4"),
  temperature: z.number().min(0).max(1).default(0.7),
  max_tokens: z.number().positive().default(4000),
  system_prompt: z.string().optional(),
});

const ChatbotsResponseSchema = z.object({
  chatbots: z.array(ChatbotSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

const CreateChatbotSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  is_public: z.boolean().default(false),
  model: z.string().default("gpt-4"),
  temperature: z.number().min(0).max(1).default(0.7),
  max_tokens: z.number().positive().default(4000),
  system_prompt: z.string().optional(),
});

const UpdateChatbotSchema = CreateChatbotSchema.partial();

export type Chatbot = z.infer<typeof ChatbotSchema>;
export type CreateChatbotData = z.infer<typeof CreateChatbotSchema>;
export type UpdateChatbotData = z.infer<typeof UpdateChatbotSchema>;

/**
 * Hook to fetch chatbots for current tenant with performance optimizations
 */
export function useChatbots(page = 1, limit = 20) {
  const { currentTenant, isLoading: tenantLoading } = useCurrentTenant();
  
  return useQuery({
    queryKey: ["chatbots", currentTenant?.id, page, limit],
    queryFn: async () => {
      const response = await apiWithTenant.get(`/chatbots?page=${page}&limit=${limit}`);
      const validatedData = ChatbotsResponseSchema.parse(response.data);
      return validatedData;
    },
    enabled: !!currentTenant?.id && !tenantLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch a single chatbot by ID
 */
export function useChatbot(id: string) {
  const { currentTenant, isLoading: tenantLoading } = useCurrentTenant();
  
  return useQuery({
    queryKey: ["chatbots", currentTenant?.id, id],
    queryFn: async (): Promise<Chatbot> => {
      const response = await apiWithTenant.get(`/chatbots/${id}`);
      return ChatbotSchema.parse(response.data.chatbot);
    },
    enabled: !!id && !!currentTenant?.id && !tenantLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to create a new chatbot with optimistic updates
 */
export function useCreateChatbot() {
  const queryClient = useQueryClient();
  const { currentTenant } = useCurrentTenant();

  return useMutation({
    mutationFn: async (data: CreateChatbotData): Promise<Chatbot> => {
      const response = await apiWithTenant.post("/chatbots", data);
      return ChatbotSchema.parse(response.data.chatbot);
    },
    onMutate: async (newChatbot) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ["chatbots", currentTenant?.id] 
      });

      // Snapshot previous value
      const previousChatbots = queryClient.getQueryData(["chatbots", currentTenant?.id, 1, 20]);

      // Optimistically update with temporary chatbot
      const tempChatbot: Chatbot = {
        id: `temp-${Date.now()}`,
        name: newChatbot.name,
        description: newChatbot.description || "",
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenant_id: currentTenant?.id || "",
        message_count: 0,
        storage_used: 0,
        is_public: newChatbot.is_public || false,
        avatar_url: null,
        model: newChatbot.model || "gpt-4",
        temperature: newChatbot.temperature || 0.7,
        max_tokens: newChatbot.max_tokens || 4000,
        system_prompt: newChatbot.system_prompt,
      };

      queryClient.setQueryData(
        ["chatbots", currentTenant?.id, 1, 20],
        (old: any) => {
          if (!old) return { chatbots: [tempChatbot], total: 1, page: 1, limit: 20 };
          return {
            ...old,
            chatbots: [tempChatbot, ...old.chatbots],
            total: old.total + 1,
          };
        }
      );

      return { previousChatbots };
    },
    onError: (_err, _newChatbot, context) => {
      // Rollback on error
      if (context?.previousChatbots) {
        queryClient.setQueryData(
          ["chatbots", currentTenant?.id, 1, 20],
          context.previousChatbots
        );
      }
    },
    onSuccess: (data) => {
      // Update with real data
      queryClient.setQueryData(
        ["chatbots", currentTenant?.id, data.id],
        data
      );
      
      // Invalidate and refetch chatbots list
      queryClient.invalidateQueries({ 
        queryKey: ["chatbots", currentTenant?.id] 
      });
    },
  });
}

/**
 * Hook to update a chatbot
 */
export function useUpdateChatbot() {
  const queryClient = useQueryClient();
  const { currentTenant } = useCurrentTenant();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateChatbotData;
    }): Promise<Chatbot> => {
      const response = await apiWithTenant.put(`/chatbots/${id}`, data);
      return ChatbotSchema.parse(response.data.chatbot);
    },
    onSuccess: (data) => {
      // Update individual chatbot cache
      queryClient.setQueryData(
        ["chatbots", currentTenant?.id, data.id],
        data
      );
      
      // Invalidate chatbots list
      queryClient.invalidateQueries({ 
        queryKey: ["chatbots", currentTenant?.id] 
      });
    },
  });
}

/**
 * Hook to delete a chatbot
 */
export function useDeleteChatbot() {
  const queryClient = useQueryClient();
  const { currentTenant } = useCurrentTenant();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiWithTenant.delete(`/chatbots/${id}`);
    },
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ["chatbots", currentTenant?.id] 
      });

      // Snapshot previous value
      const previousChatbots = queryClient.getQueryData(["chatbots", currentTenant?.id, 1, 20]);

      // Optimistically remove chatbot
      queryClient.setQueryData(
        ["chatbots", currentTenant?.id, 1, 20],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            chatbots: old.chatbots.filter((chatbot: Chatbot) => chatbot.id !== deletedId),
            total: old.total - 1,
          };
        }
      );

      return { previousChatbots };
    },
    onError: (_err, _deletedId, context) => {
      // Rollback on error
      if (context?.previousChatbots) {
        queryClient.setQueryData(
          ["chatbots", currentTenant?.id, 1, 20],
          context.previousChatbots
        );
      }
    },
    onSuccess: (_data, deletedId) => {
      // Remove from individual cache
      queryClient.removeQueries({
        queryKey: ["chatbots", currentTenant?.id, deletedId]
      });
      
      // Invalidate chatbots list
      queryClient.invalidateQueries({ 
        queryKey: ["chatbots", currentTenant?.id] 
      });
    },
  });
}

/**
 * Hook to get chatbot analytics/stats
 */
export function useChatbotStats(id: string) {
  const { currentTenant, isLoading: tenantLoading } = useCurrentTenant();
  
  return useQuery({
    queryKey: ["chatbots", currentTenant?.id, id, "stats"],
    queryFn: async () => {
      const response = await apiWithTenant.get(`/chatbots/${id}/stats`);
      return response.data;
    },
    enabled: !!id && !!currentTenant?.id && !tenantLoading,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}