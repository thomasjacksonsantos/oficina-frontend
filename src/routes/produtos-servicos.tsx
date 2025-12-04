import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/produtos-servicos")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});