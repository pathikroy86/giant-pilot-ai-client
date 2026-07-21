import crypto from "node:crypto";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const publicRoles = ["applicant", "funder"];

const globalForMongo = globalThis;

const client =
  globalForMongo.grantPilotBridgeMongoClient ||
  new MongoClient(process.env.MONGODB_URI);

if (!globalForMongo.grantPilotBridgeMongoClient) {
  globalForMongo.grantPilotBridgeMongoClient = client;
}

function getPublicRole(role) {
  return publicRoles.includes(role) ? role : "applicant";
}

function serializeUser(user) {
  return {
    id: user._id?.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    funderApprovalStatus:
      user.role === "funder" ? user.funderApprovalStatus || "pending" : "approved",
    organizationProfile: user.organizationProfile || {
      name: "",
      type: "",
    },
  };
}

export async function POST() {
  try {
    const betterAuthSession = await auth.api.getSession({
      headers: await headers(),
    });

    const betterAuthUser = betterAuthSession?.user;

    if (!betterAuthUser?.email) {
      return Response.json({ message: "Sign in required" }, { status: 401 });
    }

    await client.connect();

    const db = client.db(process.env.AUTH_DB_NAME || "grantpilot_ai");
    const usersCollection = db.collection("users");
    const sessionsCollection = db.collection("sessions");
    const normalizedEmail = betterAuthUser.email.trim().toLowerCase();
    const existingUser = await usersCollection.findOne({
      email: normalizedEmail,
    });
    const selectedRole = getPublicRole(betterAuthUser.role);
    const organizationProfile = {
      name:
        betterAuthUser.organizationName?.trim() ||
        existingUser?.organizationProfile?.name ||
        "",
      type:
        betterAuthUser.organizationType?.trim() ||
        existingUser?.organizationProfile?.type ||
        "",
    };

    let user = existingUser;

    if (existingUser) {
      const role = existingUser.role === "admin" ? "admin" : selectedRole;
      const funderApprovalStatus =
        role === "funder"
          ? existingUser.funderApprovalStatus || "pending"
          : "approved";

      await usersCollection.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            name: betterAuthUser.name || existingUser.name,
            role,
            funderApprovalStatus,
            organizationProfile,
            updatedAt: new Date(),
          },
        },
      );

      user = await usersCollection.findOne({ _id: existingUser._id });
    } else {
      const newUser = {
        name: betterAuthUser.name || normalizedEmail,
        email: normalizedEmail,
        role: selectedRole,
        funderApprovalStatus: selectedRole === "funder" ? "pending" : "approved",
        organizationProfile,
        preferences: {
          categories: [],
          regions: [],
        },
        authProvider: "better-auth",
        betterAuthUserId: betterAuthUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await usersCollection.insertOne(newUser);

      user = {
        ...newUser,
        _id: result.insertedId,
      };
    }

    const token = crypto.randomBytes(32).toString("hex");

    await sessionsCollection.insertOne({
      token,
      userId: user._id,
      authProvider: "better-auth",
      betterAuthSessionId: betterAuthSession.session?.id,
      createdAt: new Date(),
    });

    return Response.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return Response.json(
      { message: error.message || "Failed to sync authentication" },
      { status: 500 },
    );
  }
}
