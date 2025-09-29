import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/axios";

// Zod schema for user validation based on API response
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const UserResponseSchema = z.object({
  user: UserSchema,
});

const UpdateUserRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export function useUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<User> => {
      const response = await api.get("/accounts/me");
      const validatedData = UserResponseSchema.parse(response.data);
      return validatedData.user;
    },
    // Cache configuration for user data
    staleTime: 15 * 60 * 1000, // 15 minutes - user data changes less frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on authentication errors (401, 403)
      if (status === 401 || status === 403) {
        return false;
      }
      // Don't retry on other client errors (400-499)
      if (status && status >= 400 && status < 500) {
        return false;
      }
      // Retry up to 2 times on server errors or network issues
      return failureCount < 2;
    },
    networkMode: "online",
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
}

// Hook para atualizar dados do usuário
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUserRequest) => {
      const validatedData = UpdateUserRequestSchema.parse(userData);
      const response = await api.put("/accounts/me", validatedData);
      const validatedResponse = UserResponseSchema.parse(response.data);
      return validatedResponse.user;
    },
    onSuccess: () => {
      // Invalidate user queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// Hook para deletar conta do usuário
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/accounts/me");
      return response.data;
    },
    onSuccess: () => {
      // Clear all queries on account deletion
      queryClient.clear();
    },
  });
}