import { z } from "zod";
import { redirect } from '@tanstack/react-router'
import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/app/feature/dashboard";

const fallback = '/login' as const

export const Route = createFileRoute("/")({
  validateSearch: z.object({
      redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({ context, search }) => {
      if (context.auth.isAuthenticated) {
        throw redirect({ to: search.redirect || fallback })
      }
    },
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
      <Dashboard />
  );
}
