import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, queryKeys } from "../../lib";

export const useDeletePurpose = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/purposes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPurposes });
      queryClient.invalidateQueries({ queryKey: queryKeys.purposes });
    },
  });
};