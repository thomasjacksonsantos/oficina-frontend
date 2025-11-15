import { createFileRoute } from "@tanstack/react-router";
import ServiceOrderForm from "@/app/service-order/components/form/service-order-form";

export const Route = createFileRoute("/service-order/new")({
  component: NewServiceOrderComponent,
});

function NewServiceOrderComponent() {
  return <ServiceOrderForm />;
}
