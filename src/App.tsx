import { createRouter, RouterProvider } from "@tanstack/react-router";

import { ReactQueryProvider } from "@/lib/react-query-provider";
// Import the generated route tree
import { routeTree } from "@/routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

function App() {
  return (
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>
  );
}

export default App;
