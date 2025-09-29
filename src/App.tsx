import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";

import { setRouterNavigate } from "@/lib/axios";
import { ReactQueryProvider } from "@/lib/react-query-provider";
// Import the generated route tree
import { routeTree } from "@/routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

function App() {
  useEffect(() => {
    // Set router navigate function for axios interceptors
    setRouterNavigate(router.navigate);
  }, []);

  return (
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>
  );
}

export default App;
