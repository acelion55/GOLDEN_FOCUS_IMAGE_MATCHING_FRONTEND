import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";

import { DeferredAnalytics } from "@/components/deferred-analytics";
import LiquidChrome from "@/components/LiquidChrome";
import { Providers } from "@/components/providers";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoldenFocus AI",
  description:
    "AI-powered face recognition photo matching for photographers. Upload event photos, let customers find themselves instantly.",
  openGraph: {
    title: "GoldenFocus AI",
    description:
      "AI-powered face recognition photo matching for photographers. Upload event photos, let customers find themselves instantly.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoldenFocus AI",
    description:
      "AI-powered face recognition photo matching for photographers. Upload event photos, let customers find themselves instantly.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} ${GeistPixelSquare.variable} font-sans antialiased relative`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('contextmenu',function(e){var t=e.target;if(t&&(t.tagName==='IMG'||t.tagName==='VIDEO'))e.preventDefault()})`,
          }}
        />
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1, opacity: 0.3 }}>
          <LiquidChrome
            baseColor={[0.4, 0.3, 0.0]}
            speed={1}
            amplitude={0.6}
            interactive={true}
          />
        </div>
        <SmoothScroll />
        <div className="relative z-10 bg-black/5">
          <Providers>{children}</Providers>
        </div>
        <DeferredAnalytics />
      </body>
    </html>
  );
}
