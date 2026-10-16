import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Walker Marketing Suite",
  description: "Walker Automotive creative operations, events and shared media.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
