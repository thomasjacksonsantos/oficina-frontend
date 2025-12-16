import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import PaymentFormList from '@/app/payment-form';

const fallback = '/login' as const;

export const Route = createFileRoute('/forma-pagamento/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('Payment form new route beforeLoad called');
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: PaymentFormListComponent,
});

function PaymentFormListComponent() {
  return <PaymentFormList />;
}
