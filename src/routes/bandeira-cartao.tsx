import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/bandeira-cartao")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});