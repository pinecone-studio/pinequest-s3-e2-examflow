import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ApolloAppProvider } from "@/components/apollo-provider";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pinequest Team 9",
  description: "Bootstrapped with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <ApolloAppProvider>{children}</ApolloAppProvider>
      </body>
    </html>
  );
}
