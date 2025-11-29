import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import ProductGroup from "@/app/product-group";

const fallback = '/login' as const

export const Route = createFileRoute("/grupos-produtos/")({
    validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Product Group new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: ProductGroupComponent,
});

function ProductGroupComponent() {
  return (
    <ProductGroup />
  );
}
