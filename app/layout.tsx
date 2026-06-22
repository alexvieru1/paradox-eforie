import type { Metadata } from "next";
import { Newsreader, Mulish } from "next/font/google";
import { Header } from "@/components/site/header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, SITE_NAME, organizationLd } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Paradox Eforie Sud — cazare, terasă și plajă la Marea Neagră",
    template: "%s · Paradox Eforie Sud",
  },
  description:
    "Cazare în Eforie Sud la câțiva pași de plajă: Hotel Paradox, Vila Paradox și Paradox H. Terasă și plajă proprii, aproape de Techirghiol. Acceptăm vouchere de vacanță.",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Paradox Eforie Sud — cazare la Marea Neagră",
    description:
      "Cazare, terasă și plajă în Eforie Sud, aproape de Techirghiol. Acceptăm vouchere de vacanță.",
  },
  twitter: { card: "summary_large_image" },
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
        <JsonLd data={organizationLd()} />
        <MotionProvider>
          <Header />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
