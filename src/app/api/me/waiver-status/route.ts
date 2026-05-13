import connectDB from "@/database/db";
import User from "@/database/models/User";
import Waiver from "@/database/models/Waiver";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type WaiverStatusValue = "complete" | "incomplete";

const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const JOTFORM_SUBMISSIONS_LIMIT = 1000;

const apiKey = process.env.JOTFORM_API_KEY;
const baseUrl = process.env.JOTFORM_BASE_URL;
const formId = process.env.JOTFORM_WAIVER_FORM_ID;

export async function GET() {
  /*Check ENV vars*/
  if (!apiKey || !baseUrl || !formId) {
    return NextResponse.json({ error: "ENV variables invalid" }, { status: 500 });
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({
    clerkId: userId,
  });

  if (!user) {
    return NextResponse.json({ error: "No user found in database" }, { status: 404 });
  }

  const email = user.email;

  if (!email) {
    return NextResponse.json({ error: "No email found for user" }, { status: 404 });
  }

  const normalizedEmail = normalizeEmail(email);

  const existingWaiver = await Waiver.findOne({
    clerkId: userId,
  });

  if (existingWaiver) {
    const age = Date.now() - existingWaiver.waiverLastCheckedAt.getTime();
    if (age < CACHE_MAX_AGE_MS || existingWaiver.status === "complete") {
      return NextResponse.json({
        status: existingWaiver.status,
        source: "cache",
        checkedAt: existingWaiver.waiverLastCheckedAt,
      });
    }
  }

  const submissionUrl = new URL(`/form/${formId}/submissions`, baseUrl);
  submissionUrl.searchParams.set("limit", String(JOTFORM_SUBMISSIONS_LIMIT));

  const response = await fetch(submissionUrl.toString(), { headers: { APIKEY: apiKey } });

  if (!response.ok) {
    return NextResponse.json({ error: "API call failed" }, { status: 500 });
  }

  const data = await response.json();
  const submissions = data.content;

  if (!Array.isArray(submissions)) {
    return NextResponse.json({ error: "Invalid Jotform Response" }, { status: 500 });
  }

  const matchingSubmission = submissions.find((submission) => {
    return getSubmissionEmail(submission.answers) === normalizedEmail;
  });

  let status: WaiverStatusValue;
  if (matchingSubmission) {
    status = "complete";
  } else {
    status = "incomplete";
  }

  const time = new Date();

  await Waiver.findOneAndUpdate(
    { clerkId: userId },
    {
      clerkId: userId,
      email: normalizedEmail,
      status: status,
      waiverLastCheckedAt: time,
      waiverSubmissionId: matchingSubmission?.id ?? null,
    },
    { upsert: true, new: true },
  );

  return NextResponse.json({ status, source: "jotform", checkedAt: time });
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function getSubmissionEmail(answers: any) {
  if (!answers || typeof answers !== "object") {
    return null;
  }

  const vals: any[] = Object.values(answers);
  for (const item of vals) {
    if (item && typeof item === "object" && item.type === "control_email" && typeof item.answer === "string") {
      return normalizeEmail(item.answer);
    }
  }
  return null;
}
