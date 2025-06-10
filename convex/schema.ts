import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    phoneNumber: v.string(),
  }).index("phoneNumber", ["phoneNumber"]),

});
