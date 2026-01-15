import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/correcao-estoque")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});