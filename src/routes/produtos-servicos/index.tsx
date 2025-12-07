import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import Product from '@/app/product';

const fallback = '/login' as const;

export const Route = createFileRoute('/produtos-servicos/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Product new route beforeLoad called');
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: ProdutosServicos,
});

function ProdutosServicos() {
  return <Product />;
}
