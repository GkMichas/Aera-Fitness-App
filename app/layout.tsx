import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AERA — Understand your body. Become your best.",
  description: "Personal AI coaching for fitness, nutrition, recovery and progress.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
