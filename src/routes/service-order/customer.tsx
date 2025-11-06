import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/feature/customer/page"; 

export const Route = createFileRoute("/service-order/customer")({
  component: CustomerComponent,
});

function CustomerComponent() {
  return (
      <Page />
  );
}
