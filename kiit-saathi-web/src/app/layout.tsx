"use client"
import {useEffect,useState} from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ThemeProvider } from "@/hooks/useTheme";
// import { AuthProvider } from "@/hooks/useAuth";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { Toaster } from "@/components/ui/toaster";
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
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";

    const disableRightClick = (e: MouseEvent): void => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", disableRightClick);

    interface ShortcutKeyboardEvent {
      ctrlKey: boolean;
      key: string;
      preventDefault: () => void;
    }

    const disableShortcuts = (e: ShortcutKeyboardEvent): void => {
      if (
        e.ctrlKey &&
        (e.key === "u" ||
          e.key === "U" ||
          e.key === "s" ||
          e.key === "S" ||
          e.key === "p" ||
          e.key === "P" ||
          e.key === "x" ||
          e.key === "X" ||
          e.key === "a" ||
          e.key === "A" ||
          e.key === "F12")
      ) {
        e.preventDefault();
        alert("This action is disabled to protect content.");
      }
    };
    document.addEventListener("keydown", disableShortcuts);

    const checkDevTools = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        alert("Developer Tools detected! Please close it to continue.");
        window.location.reload();
      }
    };

    const interval = setInterval(checkDevTools, 2000);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableShortcuts);
      clearInterval(interval);
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
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