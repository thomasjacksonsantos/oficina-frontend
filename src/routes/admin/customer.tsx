import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/feature/customer/page"; 

export const Route = createFileRoute("/admin/customer")({
  component: CustomerComponent,
});

function CustomerComponent() {
  return (
      <Page />
  );
}
