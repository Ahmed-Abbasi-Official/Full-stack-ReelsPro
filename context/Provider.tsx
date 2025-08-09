"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactNode, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/hooks/useUser";
import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";
import { VideoProvider } from "@/hooks/useVideo";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={false} >
     <ImageKitProvider urlEndpoint={urlEndPoint}>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider> */}
          <UserProvider>
            {/* <SocketProvider> */}
              <VideoProvider>
                {children}
                <ToastContainer autoClose={2000} />
              </VideoProvider>
            {/* </SocketProvider> */}
          </UserProvider>
        {/* </ThemeProvider> */}
      </QueryClientProvider>
      </ImageKitProvider>
      </SessionProvider>
  );
}