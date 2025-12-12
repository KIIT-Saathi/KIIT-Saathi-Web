import "./globals.css";
import { Providers } from "./providers";
import { Inter, Poppins } from "next/font/google"; // Import fonts

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // Ensure heavy weights are loaded
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "KIIT Saathi",
  description: "One platform for all campus needs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 👇 THIS LINE IS CRITICAL. The variables must be here. */}
      <body className={`${inter.variable} ${poppins.variable} font-inter antialiased bg-background text-foreground`}>
        <div
          id="root"
          className="w-full overflow-hidden min-h-screen relative"
        >
          {/* Add the Grid Background here manually if it was missing */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}