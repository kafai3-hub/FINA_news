import { createFileRoute } from "@tanstack/react-router";
import { Briefing } from "@/components/briefing";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Briefing />;
}
