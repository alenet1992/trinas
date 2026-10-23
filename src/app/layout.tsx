import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/Store/Provider";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Padaria das trinas",
  description: "Developed by Alexandre Pereira",
  authors: [{ name: "Alexandre Pereira" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="trinas" className={inter.variable}>
      <body className="font-sans bg-canvas text-ink antialiased h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
