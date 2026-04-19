import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "NammaGear · Bangalore's student tech marketplace",
  description: "Pre-loved tech, campus to campus. Fair prices. Pincode-locked. Zero resellers, zero scams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <div className="grain" aria-hidden="true" />
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
