import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "@/Store/Provider";
import "react-toastify/dist/ReactToastify.css";

const poppin = Poppins({
  weight: ["100", "400"],
  subsets: ["latin"],
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
    <html lang="en">
      <body className={poppin.className + " bg-gray-50 h-screen"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
