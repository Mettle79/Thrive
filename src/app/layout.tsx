import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Banner } from "@/components/Banner";
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
        <Banner />
        <main>{children}</main>
      </body>
    </html>
  );
}
