import { Providers } from "@/providers/Providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graph",
  description: "ML Graph",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className="antialiased">{children}</body>
      </Providers>
    </html>
  );
}
