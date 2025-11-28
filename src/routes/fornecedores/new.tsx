import { z } from 'zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import SupplierForm from '@/app/supplier/components/form/supplier-form';

export const Route = createFileRoute('/fornecedores/new')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Supplier new route beforeLoad called');
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: NewSupplierComponent,
});

function NewSupplierComponent() {
  return <SupplierForm />;
}
