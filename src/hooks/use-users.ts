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
    // Performance optimizations - user data only changes when user explicitly updates it
    staleTime: 30 * 60 * 1000, // 30 minutes - user data rarely changes externally
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for entire session
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      const status = error.response?.status;
      // Don't retry on authentication errors (401, 403) - critical for auth flows
      if (status === 401 || status === 403) {
        return false;
      }
      // Don't retry on client errors (400-499) - likely permanent issues
      if (status && status >= 400 && status < 500) {
        return false;
      }
      // Retry up to 2 times on server errors (500+) or network issues
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    networkMode: "online", // Only fetch when online
    refetchOnWindowFocus: false, // User data doesn't change externally
    refetchOnMount: false, // Use cached data if available (only changes via mutations)
    refetchInterval: false, // Never poll - user data only changes via explicit actions
    refetchIntervalInBackground: false,
    // Enable persisting to localStorage for better offline UX
    meta: {
      persist: true,
    },
  });
}

// Hook para atualizar dados do usuário com otimizações
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUserRequest) => {
      const validatedData = UpdateUserRequestSchema.parse(userData);
      const response = await api.put("/accounts/me", validatedData);
      const validatedResponse = UserResponseSchema.parse(response.data);
      return validatedResponse.user;
    },
    // Optimistic updates for better UX
    onMutate: async (newUserData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["user", "me"] });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<User>(["user", "me"]);

      // Optimistically update to the new value
      if (previousUser) {
        queryClient.setQueryData<User>(["user", "me"], {
          ...previousUser,
          ...newUserData,
        });
      }

      // Return a context object with the snapshotted value
      return { previousUser };
    },
    onError: (_err, _newUserData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUser) {
        queryClient.setQueryData(["user", "me"], context.previousUser);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
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
