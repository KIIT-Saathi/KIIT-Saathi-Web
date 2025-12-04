import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "KIIT Saathi",
  description: "One platform for all campus needs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground font-inter">

        {/* EXACT REPLACEMENT FOR VITE #root */}
        <div
          id="root"
          className="max-w-[1290px] mx-auto overflow-hidden"
        >
          <Providers>{children}</Providers>
        </div>

      </body>
    </html>
  );
}
