import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentRank AI | Enterprise B2B Candidate Screening & Ranking",
  description: "AI-powered resume ranking and candidate screening engine for high-volume recruitment teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
