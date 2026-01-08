import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/lib/GameContext";

export const metadata: Metadata = {
  title: "Hang In There Until Meetings Are Over",
  description: "A turn-based social management game - Maintain relationships to keep your job!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
