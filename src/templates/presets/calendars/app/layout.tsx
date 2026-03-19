import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calendars",
  description: "User-friendly calendar UI for dashboard and admin interfaces",
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
