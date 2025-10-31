import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/app/feature/dashboard";

export const Route = createFileRoute("/admin/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
      <Dashboard />
  );
}
