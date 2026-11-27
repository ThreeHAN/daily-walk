import { createRoot as createReactRoot } from "react-dom/client";

export function markReactRoot(container) {
  container.setAttribute("data-react-root", "");
  return container;
}

export function createRoot(container) {
  return createReactRoot(markReactRoot(container));
}
