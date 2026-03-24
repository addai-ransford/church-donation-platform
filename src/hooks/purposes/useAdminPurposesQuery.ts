import { useQuery } from "@tanstack/react-query";
import { apiFetch, queryKeys } from "../../lib";
import type { AdminPurpose } from "../../types";

export const useAdminPurposesQuery = () => {
  return useQuery<AdminPurpose[]>({
    queryKey: queryKeys.adminPurposes,
    queryFn: () => apiFetch("/api/admin/totals"),
  });
};