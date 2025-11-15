import { z } from "zod";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
    throw redirect({ to: '/dashboard' })
  },
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});

