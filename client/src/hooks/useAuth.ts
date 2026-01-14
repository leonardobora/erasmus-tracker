import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";

const AUTH_QUERY_KEY = ["/api/me"];

interface AuthUser {
  username: string;
}

interface Credentials {
  username: string;
  password: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<AuthUser | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getQueryFn<AuthUser | null>({ on401: "returnNull" }),
  });

  const login = useMutation({
    mutationFn: async (credentials: Credentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return res.json() as Promise<AuthUser>;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
  });

  return {
    user: data ?? null,
    isLoading,
    isError,
    login,
    logout,
  };
}
