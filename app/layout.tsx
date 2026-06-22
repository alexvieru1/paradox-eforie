import type { Metadata } from "next";
import { Newsreader, Mulish } from "next/font/google";
import { Header } from "@/components/site/header";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paradox — Vacanța ta la mare, în Eforie Sud",
  description:
    "Hotel Paradox, Vila Paradox, Paradox H, Terasa și Plaja Paradox — cazare, terasă și plajă la câțiva pași de Marea Neagră, în stațiunea Eforie Sud. Acceptăm vouchere de vacanță.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ro"
      className={`${newsreader.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <MotionProvider>
          <Header />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
