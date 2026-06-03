import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Patua_One } from "next/font/google";
import "./globals.css";

import FooterWrapper from "@/components/FooterWrapper";
import connectDB from "../database/db";
import Waiver from "../database/models/Waiver";

const patuaOne = Patua_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-patua",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  let hasSignedWaiver = false;

  if (email) {
    await connectDB();

    const waiver = await Waiver.findOne({ email });

    hasSignedWaiver = !!waiver;
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${patuaOne.variable} antialiased`}>
          {children}

          <FooterWrapper hasSignedWaiver={hasSignedWaiver} />
        </body>
      </html>
    </ClerkProvider>
  );
}
