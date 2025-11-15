import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/admin-layout";

export const Route = createFileRoute("/service-order")({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});

