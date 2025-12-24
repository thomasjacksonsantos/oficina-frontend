import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import EntradaChaveAcesso from '@/app/entrada-chave-acesso';

const fallback = '/login' as const;

export const Route = createFileRoute('/entrada-por-nfe/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Chave Acesso new route beforeLoad called');
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: ChaveAcessoComponent,
});

function ChaveAcessoComponent() {
  return <EntradaChaveAcesso />;
}
