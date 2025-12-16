import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import Marca from "@/app/product-marca";

const fallback = '/login' as const

export const Route = createFileRoute("/marcas-produtos/")({
    validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Marca new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: MarcaComponent,
});

function MarcaComponent() {
  return (
    <Marca />
  );
}
