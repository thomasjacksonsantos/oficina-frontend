import { z } from "zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import VehicleForm from "@/app/vehicle/components/form/vehicle-form";

export const Route = createFileRoute("/veiculos/new")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Vehicle new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: NewVehicleComponent,
});

function NewVehicleComponent() {
  return <VehicleForm />;
}