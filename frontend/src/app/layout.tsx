import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentRank | Candidate Screening & Ranking",
  description: "AI-powered resume ranking and candidate screening engine for high-volume recruitment teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
