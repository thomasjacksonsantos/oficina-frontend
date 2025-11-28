import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/status-pedido-compra")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});