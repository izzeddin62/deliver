import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    email: v.optional(v.string()),
    type: v.optional(v.union(v.literal("user"), v.literal("rider"))),
    emailVerificationTime: v.optional(v.number()),
    location: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      })
    ),
  }).index("email", ["email"]),

  profiles: defineTable({
    userId: v.id("users"),
    firstName: v.string(),
    lastName: v.string(),
  }).index("by_userId", ["userId"]),

  deliveryRequests: defineTable({
    userId: v.id("users"),
    pickup: v.object({
      name: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    destination: v.object({
      name: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    status: v.union(
      v.literal("pending"),
      v.literal("awaitingPayment"),
      v.literal("assigningRider"),
      v.literal("inTransit"),
      v.literal('delivering'),
      v.literal("handoff"),
      v.literal("done")
    ),
    paymentId: v.optional(v.string()),
    riderId: v.optional(v.id("users")),

    price: v.optional(v.number()),
    distanceMeters: v.optional(v.number()),
    duration: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    contactNumber: v.optional(v.string()),
    image: v.optional(v.id("_storage"))
  }).index("by_userId", ["userId"]),

  riderAssignments: defineTable({
    deliveryRequestId: v.id("deliveryRequests"),
    riderId: v.optional(v.id("users")),
    responseAt: v.optional(v.number()),
    response: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  })
    .index("by_deliveryRequestId", ["deliveryRequestId"])
    .index("by_riderId", ["riderId"]),

    balances: defineTable({
    riderId: v.id("users"),
    amount: v.number(),
    deliveryRequestId: v.id("deliveryRequests"),
  }).index("by_riderId", ["riderId"]),

  payments: defineTable({
    deliveryRequestId: v.id("deliveryRequests"),
    status: v.union(
      v.literal("pending"),
      v.literal("successful"),
      v.literal("failed")
    ),
    ref: v.string(),
  }).index("by_deliveryRequestId", ["deliveryRequestId"]),

  withdrawals: defineTable({
    riderId: v.id("users"),
    amount: v.number(),
    phoneNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("successful"),
      v.literal("failed")
    ),
    ref: v.string(),
  }).index("by_riderId", ["riderId"]),
  friends: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
  }).index("by_userId", ["userId"]).index("by_friendId", ["friendId"]),
  friendLocationRequests: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("cancelled")
    ),
  }).index("by_userId", ["userId"]).index("by_friendId", ["friendId"]),
});
