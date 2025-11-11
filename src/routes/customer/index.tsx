import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/customer/page"; 
import Customer from "@/app/customer";

export const Route = createFileRoute("/customer/")({
  component: CustomerComponent,
});

function CustomerComponent() {
  return (
      <Customer />
  );
}
