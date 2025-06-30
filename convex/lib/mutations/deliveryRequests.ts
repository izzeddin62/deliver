import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalMutation, mutation } from "../../_generated/server";

export const createDeliveryRequest = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Example price calculation (replace with your own logic)

    // Insert the delivery request
    await ctx.runMutation(internal.lib.mutations.deliveryRequests.createPendingDeliveryRequest, {
      userId: userId,
      pickup: args.pickup,
      destination: args.destination,
    })
  },
});


export const createPendingDeliveryRequest = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Insert the delivery request
    const deliveryRequestId = await ctx.db.insert("deliveryRequests", {
      userId: args.userId,
      pickup: args.pickup,
      destination: args.destination,
      status: "pending",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.lib.actions.map.calculatePriceAndDistance,
      {
        data: {
          origin: {
            location: {
              latLng: {
                latitude: args.pickup.latitude,
                longitude: args.pickup.longitude,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: args.destination.latitude,
                longitude: args.destination.longitude,
              },
            },
          },
        },
        deliveryId: deliveryRequestId,
      }
    );

    return { deliveryRequestId };
  }
});

export const updateDeliveryPriceDistanceAndDuration = internalMutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
    distanceMeters: v.number(),
    duration: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.deliveryId, {
      price: args.price,
      distanceMeters: args.distanceMeters,
      duration: args.duration,
    });

    return { success: true };
  },
});

export const payDeliveryAndAddPhone = mutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
    phoneNumber: v.string(),
    contactNumber: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Update the delivery request with phone numbers and status
    const deliveryRequest = await ctx.db.get(args.deliveryId);
    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }
    if (deliveryRequest.userId !== userId) {
      throw new Error(
        "You do not have permission to update this delivery request"
      );
    }
    if (deliveryRequest.status !== "pending") {
      throw new Error("Cannot pay for a delivery that is not pending");
    }

    await ctx.db.patch(args.deliveryId, {
      phoneNumber: args.phoneNumber,
      contactNumber: args.contactNumber,
      status: "awaitingPayment",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.lib.actions.payment.requestPayment,
      {
        deliveryRequestId: deliveryRequest._id,
      }
    );

    return { success: true };
  },
});

export const updateDeliveryStatus = mutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
    status: v.union(
      v.literal("pending"),
      v.literal("awaitingPayment"),
      v.literal("assigningRider"),
      v.literal("inTransit"),
      v.literal("handoff"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Update the delivery request status
    const deliveryRequest = await ctx.db.get(args.deliveryId);
    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }
    if (deliveryRequest.userId !== userId) {
      throw new Error(
        "You do not have permission to update this delivery request"
      );
    }
    if (deliveryRequest.status === "done") {
      throw new Error("Cannot update a delivery that is already done");
    }
    // if (deliveryRequest.status === "cancelled") {
    //   throw new Error("Cannot update a cancelled delivery request");
    // }
    await ctx.db.patch(args.deliveryId, {
      status: args.status,
    });

    if (args.status === "awaitingPayment") {
      await ctx.scheduler.runAfter(
        0,
        internal.lib.actions.payment.requestPayment,
        {
          deliveryRequestId: deliveryRequest._id,
        }
      );
    }

    return { success: true };
  },
});

export const handlePayment = internalMutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.deliveryId, {
      status: "assigningRider",
    });

    await ctx.runMutation(internal.lib.mutations.deliveryRequests.assignRider, {
      deliveryRequestId: args.deliveryId,
    });
    return { success: true };
  },
});

export const assignRider = internalMutation({
  args: { deliveryRequestId: v.id("deliveryRequests") },
  handler: async (ctx, args) => {
    const dr = await ctx.db.get(args.deliveryRequestId);
    if (dr?.status !== "assigningRider") return;
    await ctx.scheduler.runAfter(0, internal.lib.actions.map.assignNextRider, {
      deliveryRequestId: args.deliveryRequestId,
    });
  },
});

export const handoffDelivery = mutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
    image: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Update the delivery request status
    const deliveryRequest = await ctx.db.get(args.deliveryId);
    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }
    if (deliveryRequest.riderId !== userId) {
      throw new Error(
        "You do not have permission to update this delivery request"
      );
    }
    if (deliveryRequest.status !== "delivering") {
      throw new Error("Cannot handoff a delivery that is not in transit");
    }

    await ctx.db.patch(args.deliveryId, {
      status: "handoff",
      image: args.image,
    });

    return { success: true };
  },
});

export const completeDelivery = mutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Update the delivery request status
    const deliveryRequest = await ctx.db.get(args.deliveryId);
    console.log(deliveryRequest, "============");
    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }
    if (deliveryRequest.userId !== userId) {
      throw new Error(
        "You do not have permission to update this delivery request"
      );
    }
    if (deliveryRequest.status !== "handoff") {
      throw new Error("Cannot complete a delivery that is not handed off");
    }
    if (!deliveryRequest.riderId) {
      throw new Error("No rider assigned to this delivery request");
    }

    await ctx.db.patch(args.deliveryId, {
      status: "done",
    });
    const riderAssignment = await ctx.db
      .query("riderAssignments")
      .withIndex("by_deliveryRequestId", (q) =>
        q.eq("deliveryRequestId", args.deliveryId)
      )
      .filter((q) => q.eq(q.field("response"), "accepted"))
      .first();
    console.log(riderAssignment, "========");
    if (riderAssignment) {
      await ctx.db.patch(riderAssignment._id, {
        response: "completed",
        responseAt: Date.now(),
      });
    }
    await ctx.db.insert("balances", {
      riderId: deliveryRequest.riderId,
      amount: deliveryRequest.price || 0,
      deliveryRequestId: args.deliveryId,
    });

    return { success: true };
  },
});
