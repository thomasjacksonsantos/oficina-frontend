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
    console.log('Customer new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: CustomerComponent,
});

function CustomerComponent() {
  return (
    <Customer />
  );
}
