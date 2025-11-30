import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-background text-foreground", fontSans.variable)}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 bg-gradient-to-b from-white via-slate-50 to-slate-100">
            {children}
          </main>
          <SiteFooter />
          <BackToTopButton />
        </div>
      </body>
    </html>
  );
}
