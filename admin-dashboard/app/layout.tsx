import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
const AdminLayout = dynamic(() => import("@/components/layout/AdminLayout"), {
  ssr: true,
});
import dynamic from "next/dynamic";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Admin Dashboard - Product Hunt",
  description:
    "Admin dashboard for managing Product Hunt content and settings.",
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
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
