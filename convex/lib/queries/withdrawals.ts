import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";

export const withdrawal = internalQuery({
  args: {
    withdrawalId: v.id("withdrawals"),
  },
  handler: async (ctx, args) => {
    // Fetch the withdrawal record
    const withdrawal = await ctx.db.get(args.withdrawalId);

    return { withdrawal };
  },
});


export const latestWithdrawals = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
    
        // Fetch the latest withdrawal for the authenticated user
        const withdrawals = await ctx.db
        .query("withdrawals")
        .withIndex("by_riderId", (q) => q.eq("riderId", userId))
        .order("desc")
        .take(8);
    
        return { withdrawals };
    },
})
