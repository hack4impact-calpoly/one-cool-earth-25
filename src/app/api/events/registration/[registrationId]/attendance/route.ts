import connectDB from "@/database/db";
import Registration from "@/database/models/Registration";
import { requireAdmin } from "@/lib/auth/admin";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { registrationId: string } }) {
  const admin = await requireAdmin();

  if ("error" in admin) {
    return admin.error;
  }

  try {
    const body = (await request.json()) as {
      memberIndex?: unknown;
      attended?: unknown;
    };

    if (!Number.isInteger(body.memberIndex) || typeof body.attended !== "boolean") {
      return NextResponse.json({ error: "Invalid attendance update" }, { status: 400 });
    }

    await connectDB();

    const registration = await Registration.findById(params.registrationId);

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const memberIndex = body.memberIndex as number;

    if (memberIndex < 0 || memberIndex >= registration.partyMembers.length) {
      return NextResponse.json({ error: "Party member not found" }, { status: 404 });
    }

    registration.partyMembers[memberIndex].attended = body.attended;
    await registration.save();

    return NextResponse.json({
      message: "Attendance updated successfully",
      attended: body.attended,
    });
  } catch (error) {
    console.error("Attendance Update Error:", error);
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
  }
}
