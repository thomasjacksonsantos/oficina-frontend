// app/routes/transferencia-lojas.tsx

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AdminLayout } from '@/layouts/admin-layout';

export const Route = createFileRoute('/transferencia-entre-lojas')({
  component: () => (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  ),
});