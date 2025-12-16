import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/entrada-manual")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});