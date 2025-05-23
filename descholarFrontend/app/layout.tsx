import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/globals.css";
import { ClientLayout } from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "descholar | Decentralized Scholarships on EDU Chain",
  description: "Decentralized Education Funding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
