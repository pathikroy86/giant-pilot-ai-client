import dns from "node:dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required for Better Auth");
}

dns.setServers(
  (process.env.MONGODB_DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean),
);

const globalForMongo = globalThis;

const client =
  globalForMongo.grantPilotAuthMongoClient ||
  new MongoClient(process.env.MONGODB_URI);

if (!globalForMongo.grantPilotAuthMongoClient) {
  globalForMongo.grantPilotAuthMongoClient = client;
}

const db = client.db(process.env.AUTH_DB_NAME || "grantpilot_ai");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "applicant",
        input: true,
      },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: true,
      },
      organizationName: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      organizationType: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
      funderApprovalStatus: {
        type: "string",
        required: false,
        defaultValue: "approved",
        input: false,
      },
    },
  },
});
