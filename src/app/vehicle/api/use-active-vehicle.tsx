import VehiclesApi from '@/api/vehicle.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useActiveVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => VehiclesApi.activeVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getVehicles'],
      });
    },
    onError: (error) => {
      console.error('Erro ao ativar veículo:', error);
    },
  });
}
