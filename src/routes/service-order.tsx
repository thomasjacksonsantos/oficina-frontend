import { createFileRoute } from "@tanstack/react-router";
import ServiceOrder from "@/app/service-order";

export const Route = createFileRoute("/service-order")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ServiceOrder />;
}
