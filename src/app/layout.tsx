import type { Metadata } from "next";
import localFont from "next/font/local";
import { PageShell } from "@/components/layout/PageShell";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

const geist = localFont({
  src: "../assets/fonts/geist-latin-variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../assets/fonts/geist-mono-latin-variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.srujanmirji.in"),
  title: "Srujan Mirji — AI Engineer & Product Builder",
  description:
    "Srujan Mirji is an AI engineer and product builder designing high-performance autonomous systems, intelligent tools, and refined digital experiences.",
  keywords: [
    "Srujan Mirji",
    "AI Engineer",
    "Product Builder",
    "Machine Learning",
    "Autonomous Systems",
    "Full-Stack Engineer",
    "TypeScript",
    "Next.js",
    "WebGL",
    "Portfolio",
  ],
  authors: [{ name: "Srujan Mirji", url: "https://www.srujanmirji.in" }],
  creator: "Srujan Mirji",
  publisher: "Srujan Mirji",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Srujan Mirji — AI Engineer & Product Builder",
    description:
      "Srujan Mirji is an AI engineer and product builder designing high-performance autonomous systems, intelligent tools, and refined digital experiences.",
    url: "https://www.srujanmirji.in",
    siteName: "Srujan Mirji",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Srujan Mirji — AI Engineer & Product Builder",
    description:
      "Srujan Mirji is an AI engineer and product builder designing high-performance autonomous systems, intelligent tools, and refined digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.srujanmirji.in/#person",
      "name": "Srujan Mirji",
      "jobTitle": "AI Engineer & Product Builder",
      "url": "https://www.srujanmirji.in",
      "description":
        "AI engineer and product builder designing autonomous systems, intelligent tools, and refined digital experiences.",
      "sameAs": [
        "https://github.com/srujanmirji",
        "https://www.linkedin.com/in/srujanmirji",
      ],
      "knowsAbout": [
        "Artificial Intelligence",
        "Autonomous Systems",
        "Machine Learning",
        "Full-Stack Web Development",
        "Next.js",
        "TypeScript",
        "WebGL",
        "Three.js",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.srujanmirji.in/#website",
      "url": "https://www.srujanmirji.in",
      "name": "Srujan Mirji",
      "description":
        "Srujan Mirji is an AI engineer and product builder designing high-performance autonomous systems, intelligent tools, and refined digital experiences.",
      "publisher": { "@id": "https://www.srujanmirji.in/#person" },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(geist.variable, geistMono.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
