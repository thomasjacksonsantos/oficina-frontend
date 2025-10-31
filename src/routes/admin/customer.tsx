import { createFileRoute } from "@tanstack/react-router";
import Customer from "@/app/feature/customer"; 

export const Route = createFileRoute("/admin/customer")({
  component: CustomerComponent,
});

function CustomerComponent() {
  return (
      <Customer />
  );
}
