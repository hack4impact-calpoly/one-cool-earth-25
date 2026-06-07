import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Patua_One, Lora } from "next/font/google";
import "./globals.css";

import FooterWrapper from "@/components/FooterWrapper";
import connectDB from "../database/db";
import Waiver from "../database/models/Waiver";

const patuaOne = Patua_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-patua",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  const clerkId = user?.id;
  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();

  let hasSignedWaiver = false;

  if (clerkId || email) {
    await connectDB();

    const waiver = await Waiver.findOne({
      status: "complete",
      $or: [...(clerkId ? [{ clerkId }] : []), ...(email ? [{ email }] : [])],
    }).lean();

    hasSignedWaiver = !!waiver;
  }
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${patuaOne.variable} ${lora.variable} antialiased`}>
          {children}

          <FooterWrapper initialHasSignedWaiver={hasSignedWaiver} />
        </body>
      </html>
    </ClerkProvider>
  );
}
