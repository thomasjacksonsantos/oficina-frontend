import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import Supplier from '@/app/supplier';

const fallback = '/login' as const;

export const Route = createFileRoute('/fornecedores/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Supplier new route beforeLoad called');
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: SupplierComponent,
});

function SupplierComponent() {
  return <Supplier />;
}
