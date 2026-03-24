import { useQuery } from "@tanstack/react-query";
import { apiFetch, queryKeys } from "../../lib";
import type { Purpose } from "../../types";

export const usePurposesQuery = () => {
  return useQuery<Purpose[]>({
    queryKey: queryKeys.purposes,
    queryFn: () => apiFetch("/api/purposes"),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};