import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import Vehicle from "@/app/vehicle";

const fallback = '/login' as const

export const Route = createFileRoute("/veiculos/")({
    validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Vehicle new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: VehicleComponent,
});

function VehicleComponent() {
  return (
    <Vehicle />
  );
}
