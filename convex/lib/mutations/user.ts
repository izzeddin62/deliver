import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../../_generated/server";

// Create a new profile
export const addProfile = mutation({
  args: { firstName: v.string(), lastName: v.string() },
  handler: async (ctx, { firstName, lastName }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (profile) {
      throw new Error("Profile already exists");
    }
    const newProfile = await ctx.db.insert("profiles", {
      firstName,
      lastName,
      userId,
    });
    return {
      profile: newProfile,
    };
  },
});

export const updateUserType = mutation({
  args: { type: v.union(v.literal("user"), v.literal("rider")) },
  async handler(ctx, { type }) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    if (user.type) throw new Error("User already have a type");
    await ctx.db.patch(userId, {
      type,
    });
    return {
        success: true
    }
  },
});
