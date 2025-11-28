import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/unidades-produtos")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});