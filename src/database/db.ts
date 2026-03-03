import mongoose from "mongoose";

const url: string = process.env.MONGO_URI as string;
let connection: typeof mongoose;

/**
 * Makes a connection to a MongoDB database. If a connection already exists, does nothing
 * Call this function before all api routes
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async () => {
  console.log("Attempting to connect with URI:", url ? "Defined" : "UNDEFINED");
  if (!connection) {
    connection = await mongoose.connect(url); // comment this line out if you do not have the mongo uri set up in your env vars.
    return connection;
  }
};

export default connectDB;
