import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMS",
  description: "Modern CMS dashboard for managing posts, members, and content",
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
