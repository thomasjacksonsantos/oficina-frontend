import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import Area from "@/app/product-area";

const fallback = '/login' as const

export const Route = createFileRoute("/areas-produtos/")({
    validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Product Area new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: AreaComponent,
});

function AreaComponent() {
  return (
    <Area />
  );
}
