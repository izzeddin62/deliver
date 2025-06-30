import { v } from "convex/values";
import { internalQuery } from "../../_generated/server";

export const freeRiders = internalQuery({
  args: {
    deliveryRequestId: v.id("deliveryRequests"),
  },
  handler: async (ctx, args) => {
    // Fetch riders who are free (not assigned to any delivery request)
    const riders = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("type"), "rider"))
      .collect();
    console.log(
      "Riders:",
      riders.map((rider) => rider._id)
    );

    const assignments = await ctx.db
      .query("riderAssignments")
      .filter(
        (q) =>
          q.neq(q.field("response"), "completed") ||
          q.neq(q.field("response"), "cancelled") || 
          q.neq(q.field("response"), "rejected")
      )
      .collect();
    console.log(
      "Assignments:",
      assignments.map((assignment) => assignment.riderId)
    );
    const requestAssignments = await ctx.db
      .query("riderAssignments")
      .withIndex("by_deliveryRequestId", (q) =>
        q.eq("deliveryRequestId", args.deliveryRequestId)
      )
      .filter(
        (q) =>
          q.eq(q.field("response"), "cancelled") ||
          q.eq(q.field("response"), "rejected")
      )
      .collect();

    console.log(
      "Request Assignments:",
      requestAssignments.map((assignment) => assignment.riderId)
    );

    const freeRiders = riders.filter((rider) => {
      // Check if the rider is not assigned to any delivery request
      const isAssigned = assignments.some(
        (assignment) => assignment.riderId === rider._id
      );
      const isRequestAssigned = requestAssignments.some(
        (assignment) => assignment.riderId === rider._id
      );
      return !isAssigned && !isRequestAssigned && rider.location;
    });

    return freeRiders;
  },
});
