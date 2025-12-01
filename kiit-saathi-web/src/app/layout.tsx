"use client"
import {useEffect,useState} from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ThemeProvider } from "@/hooks/useTheme";
// import { AuthProvider } from "@/hooks/useAuth";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
// import { Sonner } from "@/components/ui/sonner";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/react";
import "./globals.css";
// import PolicyWrapper from "@/components/PolicyWrapper";
// import Loader from "@/components/Loader"; // Or use next/loading

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Move useEffects from App.tsx here (GA, security)
  // ✅ Google Analytics setup
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-VYT7GP1CJE";

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-VYT7GP1CJE');
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // ✅ Existing security + UI logic


  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
          {/* <TooltipProvider>
            <ThemeProvider>
              <AuthProvider>
                <PolicyWrapper>
                  {children}
                  <Toaster />
                  <Sonner />
                </PolicyWrapper>
              </AuthProvider>
            </ThemeProvider>
          </TooltipProvider>
          <Analytics />
          <SpeedInsights /> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}