import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMEN — Where clarity meets possibility",
  description:
    "Premium digital experiences. We build next-gen interfaces for ambitious brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-primary text-highlight antialiased">
        {children}
      </body>
    </html>
  );
}
