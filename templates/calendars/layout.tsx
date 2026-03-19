import type { Metadata } from "next";
import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
