import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/")({
  component: App,
});

function App() {
  return <div className="text-center bg-red-400">Index</div>;
}
