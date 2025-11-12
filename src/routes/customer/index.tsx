import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import Customer from "@/app/customer";

const fallback = '/login' as const

export const Route = createFileRoute("/customer/")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Checking authentication status before loading /customer/...')
    console.log('Auth context:', context.auth)
    console.log('search =>', search)
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: CustomerComponent,
});

function CustomerComponent() {
  return (
    <Customer />
  );
}
