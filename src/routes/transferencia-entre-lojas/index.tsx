// app/routes/transferencia-lojas/index.tsx

import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import StoreTransfer from '@/app/store-transfer';

const fallback = '/login' as const;

export const Route = createFileRoute('/transferencia-entre-lojas/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: StoreTransferComponent,
});

function StoreTransferComponent() {
  return <StoreTransfer />;
}
