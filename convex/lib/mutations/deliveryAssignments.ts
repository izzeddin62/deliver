import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation } from "../../_generated/server";

export const createRiderAssignment = internalMutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
    riderId: v.id("users"),
  },
  handler: async ({ db }, args) => {
    const id = await db.insert("riderAssignments", {
      deliveryRequestId: args.deliveryId,
      riderId: args.riderId,
      response: "pending",
    });
    return { riderAssigmentId: id };
  },
});

export const acceptRiderAssignment = mutation({
  args: {
    assignmentId: v.id("riderAssignments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    const assignment = await ctx.db
      .query("riderAssignments")
      .filter((q) => q.eq(q.field("_id"), args.assignmentId))
      .filter((q) => q.eq(q.field("riderId"), userId))
      .first();

    if (!assignment) {
      throw new Error("Assignment not found or unauthorized");
    }

    await ctx.db.patch( assignment._id, {
        response: "accepted",
    });


    await ctx.db.patch(assignment.deliveryRequestId, {
        status: "inTransit",
        riderId: userId,
        });

    return { success: true };
  },
});



export const rejectRiderAssignment = mutation({
  args: {
    assignmentId: v.id("riderAssignments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const assignment = await ctx.db
      .query("riderAssignments")
      .filter((q) => q.eq(q.field("_id"), args.assignmentId))
      .filter((q) => q.eq(q.field("riderId"), userId))
      .first();

    if (!assignment) {
      throw new Error("Assignment not found or unauthorized");
    }

    await ctx.db.patch(assignment._id, {
      response: "rejected",
    });

    return { success: true };
  },
});