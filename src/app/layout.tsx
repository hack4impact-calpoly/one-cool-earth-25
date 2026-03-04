import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Lora } from "next/font/google";
import "./globals.css"; // Ensure your global styles are imported

// 1. Configure the Patua One font
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${lora.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
