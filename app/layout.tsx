import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Restaurant Menu",
  description: "Digital menu for your restaurant",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#2563eb",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
