import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Collaborative workspace dashboard with timesheets and progress tracking",
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
