import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Responsive inbox interface for email and messaging",
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
