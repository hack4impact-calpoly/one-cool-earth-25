//import { connectDB } from "src/database/db";
import connectDB from "@/database/db";
import Organization from "@/database/models/Organization";
import School from "@/database/models/School";
import Volunteer from "@/database/models/Volunteer";
import Event from "@/database/models/Event";

export async function POST() {
  await connectDB();

  // 1) Ensure indexes exist (unique, etc.)
  await Promise.all([Organization.syncIndexes(), School.syncIndexes(), Volunteer.syncIndexes(), Event.syncIndexes()]);

  // 2) Create one “dummy” doc in each collection (upsert) so Mongo creates the collection
  await Promise.all([
    Organization.updateOne({ name: "__init__" }, { $setOnInsert: { name: "__init__" } }, { upsert: true }),
    School.updateOne({ name: "__init__" }, { $setOnInsert: { name: "__init__" } }, { upsert: true }),
    Volunteer.updateOne(
      { email: "__init__@example.com" },
      {
        $setOnInsert: {
          kind: "GUEST",
          firstName: "Init",
          lastName: "User",
          email: "__init__@example.com",
        },
      },
      { upsert: true },
    ),
    Event.updateOne({ name: "__init__" }, { $setOnInsert: { name: "__init__", time: new Date() } }, { upsert: true }),
  ]);

  return Response.json({
    ok: true,
    message: "Initialized DB: collections + indexes created for Organization, School, Volunteer, Event.",
  });
}
