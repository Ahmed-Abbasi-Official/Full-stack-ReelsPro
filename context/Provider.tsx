"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactNode, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/hooks/useUser";
import { VideoProvider } from "@/hooks/useVideo";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./themeMode";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider> */}
          <UserProvider>
            {/* <SocketProvider> */}
              {/* <VideoProvider> */}
                {children}
                <ToastContainer autoClose={2000} />
              {/* </VideoProvider> */}
            {/* </SocketProvider> */}
          </UserProvider>
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </SessionProvider>
  );
}