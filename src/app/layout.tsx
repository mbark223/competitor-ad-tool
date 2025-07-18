import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Competitor Ad Intelligence",
  description: "Internal tool for monitoring competitor advertising across platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <Providers>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </Providers>
      </body>
    </html>
  );
}
