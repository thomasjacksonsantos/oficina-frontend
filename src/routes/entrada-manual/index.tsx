import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { z } from 'zod';
import ManualEntry from '@/app/manual-entry';

const fallback = '/login' as const;

export const Route = createFileRoute('/entrada-manual/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('ManualEntry new route beforeLoad called');
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' });
    }
  },
  component: ManualEntryComponent,
});

function ManualEntryComponent() {
  return <ManualEntry />;
}
