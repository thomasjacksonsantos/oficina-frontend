import { createFileRoute } from "@tanstack/react-router";
import CustomerForm from "@/app/customer/components/form/customer-form";

export const Route = createFileRoute("/customer/new")({
  component: NewCustomerComponent,
});

function NewCustomerComponent() {
  return <CustomerForm />;
}
