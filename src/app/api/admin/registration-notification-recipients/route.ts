import connectDB from "@/database/db";
import NotificationSettings, { REGISTRATION_NOTIFICATION_SETTINGS_KEY } from "@/database/models/NotificationSettings";
import { requireAdmin } from "@/lib/auth/admin";
import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type NotificationSettingsLean = { emails?: string[] } | null;

function normalizeEmails(value: unknown) {
  if (!Array.isArray(value)) {
    return { error: "Emails must be an array." };
  }

  const emails = Array.from(
    new Set(value.map((email) => (typeof email === "string" ? email.trim().toLowerCase() : "")).filter(Boolean)),
  );

  const invalidEmail = emails.find((email) => !emailPattern.test(email));

  if (invalidEmail) {
    return { error: `${invalidEmail} is not a valid email address.` };
  }

  return { emails };
}

export async function GET() {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  await connectDB();

  const settings = (await NotificationSettings.findOne({
    key: REGISTRATION_NOTIFICATION_SETTINGS_KEY,
  }).lean()) as NotificationSettingsLean;

  return NextResponse.json({ emails: settings?.emails ?? [] });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const body = await request.json().catch(() => null);
  const normalized = normalizeEmails(body?.emails);

  if ("error" in normalized) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  await connectDB();

  const settings = (await NotificationSettings.findOneAndUpdate(
    { key: REGISTRATION_NOTIFICATION_SETTINGS_KEY },
    {
      key: REGISTRATION_NOTIFICATION_SETTINGS_KEY,
      emails: normalized.emails,
      updatedBy: admin.userId,
    },
    { upsert: true, new: true },
  ).lean()) as NotificationSettingsLean;

  return NextResponse.json({ emails: settings?.emails ?? [] });
}
