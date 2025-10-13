import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Evita refetches desnecessários durante navegação
      staleTime: 2 * 60 * 1000, // 2 minutos - dados são considerados "fresh"
      gcTime: 10 * 60 * 1000, // 10 minutos - mantém dados em cache

      // Desabilita refetch automático em focus/mount se dados estão fresh
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,

      // Retry strategy conservadora
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
