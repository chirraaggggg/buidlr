import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const jostSans = Jost({
  variable: "--font-jost-sans",
  subsets: ["latin"],
});

const jostMono = Jost({
  variable: "--font-jost-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buildr - AI-Powered App Design",
  description: "Buildr is an AI-powered app design tool that helps you create stunning app designs effortlessly. With Buildr, you can generate design suggestions, customize layouts, and bring your app ideas to life in no time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
  );
}
