import type { Metadata } from "next";
import { Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VISTA.IO | Advanced Data Analytics Platform",
  description: "The standard in new data analysis. Use data to get a 360-degree view of your business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-black text-white font-sans antialiased selection:bg-[#FF5050] selection:text-white">
        {children}
      </body>
    </html>
  );
}
