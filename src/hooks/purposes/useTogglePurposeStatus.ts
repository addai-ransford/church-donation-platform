import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, queryKeys } from "../../lib";

export const useTogglePurposeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiFetch(`/api/admin/purposes/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPurposes });
      queryClient.invalidateQueries({ queryKey: queryKeys.purposes });
    },
  });
};