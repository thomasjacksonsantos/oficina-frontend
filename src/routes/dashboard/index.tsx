import { z } from "zod";
import { redirect } from '@tanstack/react-router'
import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/app/feature/dashboard";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/dashboard/")({
    validateSearch: z.object({
      redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({ context, search }) => {
      if (!context.auth.isAuthenticated) {
        throw redirect({ to: '/login' })
      }      
    },
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}
