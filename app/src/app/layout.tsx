import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Learning Exchange",
  description: "A nonprofit-first global learning marketplace MVP."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
