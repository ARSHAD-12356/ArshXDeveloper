import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Inter_Tight, JetBrains_Mono, Montserrat } from "next/font/google";
import { profile } from "@/data/site";
import { PreloaderProvider } from "@/components/providers/Preloader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { CursorSplash } from "@/components/ui/CursorSplash";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", weight: ["400", "500", "600", "700", "800"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-family", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], variable: "--font-bebas", weight: "400", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["600", "700"], display: "swap" });

const title = `${profile.name} - ${profile.role} & ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.intro,
  keywords: ["Full Stack Developer", "Next.js", "React", "Node.js", "TypeScript", "Freelance Developer", profile.name],
  authors: [{ name: profile.name, url: profile.url }],
  icons: {
    icon: [
      { url: "/favicon-final.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon-final.png",
    apple: "/favicon-final.png",
  },
  openGraph: {
    type: "website",
    url: profile.url,
    title,
    description: profile.intro,
    siteName: profile.name,
    images: [{ url: "/preview.png", width: 1899, height: 866, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description: profile.intro, images: ["/preview.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${mono.variable} ${montserrat.variable} ${bebas.variable}`}>
      <body className="grain">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-fg px-4 py-2 text-sm text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <PreloaderProvider>
            <CursorSplash />
            {children}
            <Cursor />
          </PreloaderProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}