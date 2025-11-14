
import { createFileRoute } from "@tanstack/react-router";
import SignupConfirmed from "@/app/account/signup-confirmation";

export const Route = createFileRoute("/signup-confirmation")({  
  component: () => (
    <SignupConfirmed />
  ),
});

