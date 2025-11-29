import VehiclesApi from '@/api/vehicle.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VehiclesApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getVehicles'],
      });
    },
    onError: (error) => {
      console.error('Erro ao deletar ordem de veiculo:', error);
    },
  });
}
