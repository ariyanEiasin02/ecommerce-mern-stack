import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopHub — Online Shopping for Electronics, Fashion & More",
    template: "%s | ShopHub",
  },
  description:
    "Shop the latest electronics, fashion, home goods and more at ShopHub. Free shipping on orders over $50. Easy returns. Secure checkout.",
  keywords: [
    "online shopping",
    "ecommerce",
    "electronics",
    "fashion",
    "deals",
    "free shipping",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ShopHub",
    title: "ShopHub — Online Shopping for Electronics, Fashion & More",
    description:
      "Discover top-rated products at great prices. Free shipping on orders over $50.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub — Online Shopping",
    description:
      "Discover top-rated products at great prices. Free shipping on orders over $50.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@flaticon/flaticon-uicons/css/all/all.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@flaticon/flaticon-uicons/css/brands/all.css"
        />
      </head>
      <body className={`${inter.variable}`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}