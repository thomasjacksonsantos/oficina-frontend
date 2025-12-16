import VehiclesApi from "@/api/vehicle.api";
import { UpdateVehicleInput } from "@/api/vehicle.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vehicle }: { id: string,  vehicle: UpdateVehicleInput }) =>
      VehiclesApi.updateVehicle(vehicle, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['getVehicles'],
      });
      queryClient.invalidateQueries({
        queryKey: ['getVehicle', variables.vehicle.id],
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar ordem de serviço:", error);
    },
  })
}

