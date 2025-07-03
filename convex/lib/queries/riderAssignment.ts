import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "../../_generated/server";

export const riderAssignment = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const riderAssignment = await ctx.db
      .query("riderAssignments")
      .withIndex("by_riderId", (q) => q.eq("riderId", userId))
      .filter(
        (q) =>
          q.neq(q.field("response"), "cancelled") &&
          q.neq(q.field("response"), "completed")
      )
      .first();
    if (!riderAssignment)
      return {
        riderAssignment: null,
        deliveryRequest: null,
      };

    const deliveryRequest = await ctx.db.get(riderAssignment.deliveryRequestId);
    const requester = deliveryRequest ? await ctx.db.get(deliveryRequest.userId) : null;


    return {
      riderAssignment: riderAssignment,
      deliveryRequest: deliveryRequest,
      requester
    };
  },
});
