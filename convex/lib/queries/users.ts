import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Doc } from "../../_generated/dataModel";
import { internalQuery, query } from "../../_generated/server";

type Profile = Doc<"profiles">;
// get current user;
export const currentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    let profile: Profile | null = null;
    const user = await ctx.db.get(userId);
    if (user?.type === "rider") {
      profile = await ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique();
    }
    return {
      user,
      profile,
    };
  },
});

export const user = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler(ctx, { userId }) {
    return ctx.db.get(userId);
  },
});
