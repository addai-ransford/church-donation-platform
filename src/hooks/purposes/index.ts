import { useAdminPurposesQuery } from "./useAdminPurposesQuery";
import { useCreatePurpose } from "./useCreatePurpose";
import { useDeletePurpose } from "./useDeletePurpose";
import { useTogglePurposeStatus } from "./useTogglePurposeStatus";

export const useAdminPurposes = () => {
    const { data: purposes = [], isLoading } = useAdminPurposesQuery();

    const createPurpose = useCreatePurpose();
    const deletePurpose = useDeletePurpose();
    const togglePurposeStatus = useTogglePurposeStatus();

    return {
        purposes,
        isLoading,
        createPurpose: createPurpose.mutate,
        deletePurpose: deletePurpose.mutate,
        togglePurposeStatus: togglePurposeStatus.mutate,
        isCreating: createPurpose.isPending,
        isTogglingStatus: togglePurposeStatus.isPending,
    };
};


export * from "./useCreatePurpose";
export * from "./useDeletePurpose";
export * from "./usePurposesQuery";
export * from "./useAdminPurposesQuery";
export * from "./useTogglePurposeStatus";