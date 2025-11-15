import { z } from "zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import CustomerForm from "@/app/customer/components/form/customer-form";

export const Route = createFileRoute("/customer/new")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Customer new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: NewCustomerComponent,
});

function NewCustomerComponent() {
  return <CustomerForm />;
}
