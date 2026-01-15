// app/routes/correcao-estoque/index.tsx

import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import StockCorrection from '@/app/stock-correction';

const fallback = '/login' as const;

export const Route = createFileRoute('/correcao-estoque/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: StockCorrectionComponent,
});

function StockCorrectionComponent() {
  return <StockCorrection />;
}
