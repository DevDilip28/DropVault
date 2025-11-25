"use client";

import type { ThemeProviderProps } from "next-themes";
import { ImageKitProvider } from "@imagekit/next";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
    >
      {children}
    </ImageKitProvider>
  );
}
