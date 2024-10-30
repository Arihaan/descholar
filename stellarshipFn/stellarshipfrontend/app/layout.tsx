import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ConnectButton } from "./components/connect";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellarship",
  description:
    "Stellarship is a platform for students to apply for scholarships",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
