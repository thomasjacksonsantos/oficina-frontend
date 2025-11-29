import { z } from "zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import ProductGroupForm from "@/app/product-group/components/form/product-group-form";

export const Route = createFileRoute("/grupos-produtos/new")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Product Group new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: NewGrupoProdutosComponent,
});

function NewGrupoProdutosComponent() {
  return <ProductGroupForm />;
}