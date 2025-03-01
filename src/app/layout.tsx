import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children} <Toaster /></main>
      </body>
    </html>
  );
}
