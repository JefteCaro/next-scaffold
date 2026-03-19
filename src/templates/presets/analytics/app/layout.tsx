import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Transform data into visual insights with intuitive charts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
