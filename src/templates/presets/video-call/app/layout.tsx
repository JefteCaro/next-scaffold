import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Call",
  description: "Modern video call application UI for real-time communication",
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
