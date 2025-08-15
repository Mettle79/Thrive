import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConditionalBanner } from "@/components/ConditionalBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Escape Room Challenge",
  description: "A challenging escape room experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConditionalBanner />
        <main>{children}</main>
      </body>
    </html>
  );
}
