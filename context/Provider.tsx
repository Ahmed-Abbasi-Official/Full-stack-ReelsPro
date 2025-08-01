// components/Providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactNode, useState} from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(()=> new QueryClient()) ;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer autoClose={2000} />
    </QueryClientProvider>
  );
}
