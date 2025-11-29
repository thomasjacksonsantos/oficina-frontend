import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import StoreSetting from "@/app/store-settings";

const fallback = '/login' as const

export const Route = createFileRoute("/loja/")({
    validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('StoreSetting new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: StoreSettingComponent,
});

function StoreSettingComponent() {
  return (
    <StoreSetting />
  );
}
