import connectDB from "@/database/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Example GET API route
 * @returns {message: string}
 */
export async function GET() {
  await connectDB();
  return NextResponse.json({ message: "Hello from the API!" });
}
