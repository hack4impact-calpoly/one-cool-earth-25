import connectDB from "@/database/db";
import User from "@/database/models/User";
import Waiver from "@/database/models/Waiver";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const CACHE_MAX_AGE_MS = 0;
const JOTFORM_SUBMISSIONS_LIMIT = 1000;

const apiKey = process.env.JOTFORM_API_KEY;
const baseUrl = process.env.JOTFORM_BASE_URL;

const formIds = [process.env.JOTFORM_ENGLISH_WAIVER_FORM_ID, process.env.JOTFORM_SPANISH_WAIVER_FORM_ID].filter(
  Boolean,
) as string[];

export async function GET() {
  if (!apiKey || !baseUrl || formIds.length === 0) {
    return NextResponse.json({ error: "ENV variables invalid" }, { status: 500 });
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ clerkId: userId });

  if (!user?.email) {
    return NextResponse.json({ error: "No user/email found" }, { status: 404 });
  }

  const normalizedEmail = normalizeEmail(user.email);

  const existingWaiver = await Waiver.findOne({
    $or: [{ clerkId: userId }, { email: normalizedEmail }],
    status: "complete",
  });

  if (existingWaiver) {
    const age = Date.now() - existingWaiver.waiverLastCheckedAt.getTime();

    if (age < CACHE_MAX_AGE_MS) {
      const completedSchools = await Waiver.find({
        $or: [{ clerkId: userId }, { email: normalizedEmail }],
        status: "complete",
      }).distinct("schoolNormalized");

      return NextResponse.json({
        waiverCompleted: true,
        completedSchools,
        source: "cache",
        checkedAt: existingWaiver.waiverLastCheckedAt,
      });
    }
  }

  const allMatchingSubmissions: any[] = [];

  for (const formId of formIds) {
    const submissionUrl = new URL(`/form/${formId}/submissions`, baseUrl);
    submissionUrl.searchParams.set("limit", String(JOTFORM_SUBMISSIONS_LIMIT));

    const response = await fetch(submissionUrl.toString(), {
      headers: { APIKEY: apiKey },
      cache: "no-store",
    });

    if (!response.ok) {
      continue;
    }

    const data = await response.json();
    const submissions = data.content;

    if (!Array.isArray(submissions)) {
      continue;
    }

    const matches = submissions.filter((submission) => {
      return getSubmissionEmail(submission.answers) === normalizedEmail;
    });

    allMatchingSubmissions.push(...matches);
  }
  const waiverCompleted = allMatchingSubmissions.length > 0;
  const time = new Date();

  if (waiverCompleted) {
    await Waiver.findOneAndUpdate(
      { email: normalizedEmail },
      {
        clerkId: userId,
        email: normalizedEmail,
        school: "General",
        schoolNormalized: "general",
        status: "complete",
        waiverSignedAt: time,
        waiverLastCheckedAt: time,
      },
      { upsert: true, new: true },
    );
  }

  return NextResponse.json({
    waiverCompleted,
    completedSchools: waiverCompleted ? ["general"] : [],
    source: "jotform",
    checkedAt: time,
  });
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function normalizeSchool(school: string) {
  return school.toLowerCase().trim().replace(/\./g, "").replace(/\s+/g, " ");
}

function getSubmissionEmail(answers: any) {
  if (!answers || typeof answers !== "object") return null;

  const vals: any[] = Object.values(answers);

  for (const item of vals) {
    if (item && typeof item === "object" && item.type === "control_email" && typeof item.answer === "string") {
      return normalizeEmail(item.answer);
    }
  }

  return null;
}

// function getSubmissionSchool(answers: any) {
//   if (!answers || typeof answers !== "object") return null;

//   const vals: any[] = Object.values(answers);

//   for (const item of vals) {
//     if (item && typeof item === "object" && item.name === schoolFieldName && typeof item.answer === "string") {
//       return normalizeSchool(item.answer);
//     }
//   }

//   return null;
// }
