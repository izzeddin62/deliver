import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";

// get current delivery request
export const ActiveDeliveryRequest = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    if (user?.type === "rider") return null;

    const latestRequest = await ctx.db
      .query("deliveryRequests")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter(
        (q) =>
          q.and(
            q.neq(q.field("status"), "cancelled"),
            q.neq(q.field("status"), "done")
          ) // Only if "cancelled" is a possible status
      )
      .order("desc")
      .first();

    const imageUrl =
      latestRequest && latestRequest.image
        ? await ctx.storage.getUrl(latestRequest.image)
        : null;

    const rider = latestRequest?.riderId
      ? await ctx.db.get(latestRequest.riderId)
      : null;

    return {
      deliveryRequest: latestRequest,

      imageUrl,
      rider: rider,
    };
  },
});

export const deliveryRequest = internalQuery({
  args: {
    deliveryRequestId: v.id("deliveryRequests"),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db.get(args.deliveryRequestId);
    return requests;
  },
});
