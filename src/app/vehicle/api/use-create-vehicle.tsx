import VehiclesApi from "@/api/vehicle.api";
import { CreateVehicleInput } from "@/api/vehicle.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicle: CreateVehicleInput) => 
      VehiclesApi.createVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getVehicles'],
      });
    },
    onError: (error) => {
      console.error("Erro ao criar ordem de veiculo:", error);
    },
  })
}

