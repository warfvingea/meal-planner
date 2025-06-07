import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Måltidsplanerare - AI-driven måltidsplanering",
  description: "Planera dina veckomåltider med AI-hjälp. Få receptförslag med dolda grönsaker för barn och gourmeträtter för hela familjen.",
  keywords: "måltidsplanering, recept, AI, barnmat, gourmet, veckomeny, inköpslista",
  authors: [{ name: "Meal Planner" }],
  openGraph: {
    title: "Måltidsplanerare - AI-driven måltidsplanering",
    description: "Planera dina veckomåltider med AI-hjälp. Få receptförslag med dolda grönsaker för barn och gourmeträtter för hela familjen.",
    type: "website",
    locale: "sv_SE",
  },
  twitter: {
    card: "summary",
    title: "Måltidsplanerare",
    description: "AI-driven måltidsplanering för hela familjen",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-2 rounded"
        >
          Hoppa till huvudinnehåll
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
