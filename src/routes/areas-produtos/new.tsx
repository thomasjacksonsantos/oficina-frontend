import { z } from "zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import AreaForm from "@/app/product-area/components/form/product-area-form";

export const Route = createFileRoute("/areas-produtos/new")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Product Area new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: NewAreaComponent,
});

function NewAreaComponent() {
  return <AreaForm />;
}