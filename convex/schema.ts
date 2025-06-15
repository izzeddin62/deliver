import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    email: v.optional(v.string()),
    type: v.optional(v.union(v.literal("user"), v.literal("rider"))),
    emailVerificationTime: v.optional(v.number()),
  }).index("email", ["email"]),

  profiles: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
  }).index("by_userId", ["userId"]),
});
