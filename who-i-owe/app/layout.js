import "./globals.css";

export const metadata = {
  title: "Who I Owe 💸",
  description: "Tap your name to see what's up",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}