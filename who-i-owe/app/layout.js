import "./globals.css";
import { Syne, DM_Sans } from "next/font/google";

const display = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Who I Owe 💸",
  description: "Tap your name to see what's up",
};

export const viewport = {
  themeColor: "#07070b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}