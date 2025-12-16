import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import BandeiraCartao from '@/app/bandeira-cartao';

const fallback = '/login' as const;

export const Route = createFileRoute('/bandeira-cartao/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Bandeira Cartao new route beforeLoad called');
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: BandeiraCartaoComponent,
});

function BandeiraCartaoComponent() {
  return <BandeiraCartao />;
}
