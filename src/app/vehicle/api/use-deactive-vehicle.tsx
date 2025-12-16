import VehiclesApi from '@/api/vehicle.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeactiveVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VehiclesApi.deactiveVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getVehicles'],
      });
    },
    onError: (error) => {
      console.error('Erro ao desativar veículo:', error);
    },
  });
}
