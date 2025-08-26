import NewServiceOrder from "@/app/new-service-order";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/nova-ordem-servico")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewServiceOrder />;
}
