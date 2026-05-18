import connectDB from "@/database/db";
import User from "@/database/models/User";
import Waiver from "@/database/models/Waiver";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX_AGE_MS = 1000 * 2;
const JOTFORM_SUBMISSIONS_LIMIT = 1000;

const apiKey = process.env.JOTFORM_API_KEY;
const baseUrl = process.env.JOTFORM_BASE_URL;
const formId = process.env.JOTFORM_WAIVER_FORM_ID;
const schoolFieldName = process.env.JOTFORM_SCHOOL_FIELD_NAME;

export async function GET() {
  /*Check ENV vars*/
  if (!apiKey || !baseUrl || !formId || !schoolFieldName) {
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

  const existingWaivers = await Waiver.find({
    clerkId: userId,
  });

  if (existingWaivers.length > 0) {
    const allWaiversFresh = existingWaivers.every((waiver) => {
      const age = Date.now() - waiver.waiverLastCheckedAt.getTime();
      return age < CACHE_MAX_AGE_MS;
    });

    if (allWaiversFresh) {
      const completedSchools = existingWaivers.map((waiver) => {
        return waiver.schoolNormalized;
      });
      return NextResponse.json({
        completedSchools,
        source: "cache",
        checkedAt: existingWaivers[0].waiverLastCheckedAt,
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

  const matchingSubmissions = submissions.filter((submission) => {
    return getSubmissionEmail(submission.answers) === normalizedEmail;
  });

  const completedSchools = Array.from(
    new Set(
      matchingSubmissions
        .map((submission) => {
          return getSubmissionSchool(submission.answers);
        })
        .filter((school) => {
          return school !== null;
        }),
    ),
  );

  const time = new Date();

  for (const school of completedSchools) {
    await Waiver.findOneAndUpdate(
      {
        clerkId: userId,
        schoolNormalized: school,
      },
      {
        clerkId: userId,
        schoolNormalized: school,
        email: normalizedEmail,
        status: "complete",
        waiverLastCheckedAt: time,
      },
      { upsert: true, new: true },
    );
  }

  return NextResponse.json({ completedSchools, source: "jotform", checkedAt: time });
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function normalizeSchool(school: string) {
  return school.toLowerCase().trim().replace(/\s+/g, " ");
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

function getSubmissionSchool(answers: any) {
  if (!answers || typeof answers !== "object") {
    return null;
  }

  const vals: any[] = Object.values(answers);

  for (const item of vals) {
    if (item && typeof item === "object" && item.name === schoolFieldName && typeof item.answer === "string") {
      return normalizeSchool(item.answer);
    }
  }
  return null;
}
