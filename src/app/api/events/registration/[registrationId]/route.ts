import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Registration from "@/database/models/Registration";

// Return a specific registration
export async function GET(request: Request, { params }: { params: { registrationId: string } }) {
  try {
    await connectDB();
    const registration = await Registration.findById(params.registrationId);

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ registration });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 });
  }
}

// Patch a specific registration
export async function PATCH(request: Request, { params }: { params: { registrationId: string } }) {
  try {
    await connectDB();
    const body = await request.json();

    const updated = await Registration.findByIdAndUpdate(
      params.registrationId,
      {
        $set: {
          partyMembers: body.partyMembers,
          affiliatedOrganization: body.affiliatedOrganization,
          additionalComments: body.additionalComments,
        },
      },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Registration edited successfully", registration: updated }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}

// Delete a specific registration
export async function DELETE(request: Request, { params }: { params: { registrationId: string } }) {
  try {
    await connectDB();

    const deleted = await Registration.findByIdAndDelete(params.registrationId);

    if (!deleted) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Registration deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 });
  }
}
