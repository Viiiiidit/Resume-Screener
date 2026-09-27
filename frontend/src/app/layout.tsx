import type { Metadata } from "next";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VISTA.IO // TALENT ANALYSIS | Autonomous Candidate Ranking",
  description: "The standard in new data analysis. High-throughput neural resume screening and candidate evaluation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col bg-black text-white font-sans antialiased selection:bg-[#FF3333] selection:text-white">
        {children}
      </body>
    </html>
  );
}
