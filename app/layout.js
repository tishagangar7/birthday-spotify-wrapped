import { Archivo, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// Archivo Black-weight for headline numbers/titles (Wrapped-style geometric,
// extremely bold display type); Inter for body copy, eyebrow labels, and names.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "actual life — ali",
  description: "21 years recorded by the people who were there.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
