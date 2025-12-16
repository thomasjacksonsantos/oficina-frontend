import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import ProductUnit from "@/app/product-unit";

const fallback = '/login' as const

export const Route = createFileRoute("/unidades-produtos/")({
    validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Product Unit new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: ProductUnitComponent,
});

function ProductUnitComponent() {
  return (
    <ProductUnit />
  );
}
