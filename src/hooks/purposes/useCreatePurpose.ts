import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, queryKeys } from "../../lib";

export const useCreatePurpose = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (label: string) =>
      apiFetch("/api/admin/purposes", {
        method: "POST",
        body: JSON.stringify({ label }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPurposes });
      queryClient.invalidateQueries({ queryKey: queryKeys.purposes });
    },
  });
};