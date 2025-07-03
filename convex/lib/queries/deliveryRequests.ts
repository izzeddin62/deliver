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

    const riderProfile = rider
      ? await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", rider._id))
          .first()
      : null;

    return {
      deliveryRequest: latestRequest,

      imageUrl,
      rider: rider,
      riderProfile,
    };
  },
});

export const riderActiveDeliveryRequest = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    if (user?.type === "user") return null;

    const latestRequest = await ctx.db
      .query("deliveryRequests")
      .filter((q) =>
        q.and(
          q.eq(q.field("riderId"), userId),
          q.neq(q.field("status"), "cancelled"),
          q.neq(q.field("status"), "done")
        )
      )
      .order("desc")
      .first();

    return {
      deliveryRequest: latestRequest,
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

export const latestDeliveryRequests = query({
  async handler(ctx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const deliveryRequests = await ctx.db
      .query("deliveryRequests")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "cancelled"),
          q.eq(q.field("status"), "done")
        )
      )
      .order("desc")
      .take(6);

    const grouped = deliveryRequests.reduce(
      (acc, req) => {
        const date = new Date(req._creationTime).toISOString().slice(0, 10);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(req);
        return acc;
      },
      {} as Record<string, typeof deliveryRequests>
    );

    return {
      deliveryRequests,
      groupRequests: grouped,
    };
  },
});

export const riderLatestDeliveryRequests = query({
  async handler(ctx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const deliveryRequests = await ctx.db
      .query("deliveryRequests")
      .filter((q) =>
        q.and(
          q.eq(q.field("riderId"), userId),
          q.or(
            q.eq(q.field("status"), "cancelled"),
            q.eq(q.field("status"), "done")
          )
        )
      )
      .order("desc")
      .take(6);

    const grouped = deliveryRequests.reduce(
      (acc, req) => {
        const date = new Date(req._creationTime).toISOString().slice(0, 10);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(req);
        return acc;
      },
      {} as Record<string, typeof deliveryRequests>
    );

    return {
      deliveryRequests,
      groupRequests: grouped,
    };
  },
});
