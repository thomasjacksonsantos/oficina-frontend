import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { NavBar } from "@/components/organism/navbar";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <section className="h-screen">
      <NavBar />
    </section>
  );
}
