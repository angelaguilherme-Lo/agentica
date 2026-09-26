import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGENTICA — Agentic AI Periodic Table Game",
  description: "Understand, build, run, break and fix agentic AI systems through an interactive periodic-table game.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
