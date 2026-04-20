import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Student Gear Shop · Bangalore's student tech marketplace",
  description: "Pre-loved tech, campus to campus. Fair prices. Pincode-locked. Zero resellers, zero scams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Caveat:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <div className="grain" aria-hidden="true" />
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
