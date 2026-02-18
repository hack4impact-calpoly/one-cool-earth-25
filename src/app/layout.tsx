import { Patua_One } from "next/font/google";
import "./globals.css"; // Ensure your global styles are imported

// 1. Configure the Patua One font
const patua = Patua_One({
  weight: "400", // Patua One only has a 400 weight available
  subsets: ["latin"],
  variable: "--font-patua", // This creates the hook for Tailwind
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${patua.variable} antialiased`}>{children}</body>
    </html>
  );
}
