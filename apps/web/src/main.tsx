import {
  createRouter,
  parseSearchWith,
  RouterProvider,
  stringifySearchWith,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { routeTree } from "./routeTree.gen";

import "./global.css";
import { parse, stringify } from "jsurl2";
import reportWebVitals from "./reportWebVitals.ts";
import { useAuthStore } from "./store/index.ts";

// Create a new router instance
const router = createRouter({
  parseSearch: parseSearchWith(parse),
  stringifySearch: stringifySearchWith(stringify),
  routeTree,
  context: {
    auth: undefined,
    queryClient: undefined,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerRouter = () => {
  const auth = useAuthStore();
  return <RouterProvider router={router} context={{ auth: auth.token }} />;
};

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <InnerRouter />
    </StrictMode>,
  );
}

reportWebVitals(console.log);
