import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "../../_generated/api";
import { internalMutation, mutation } from "../../_generated/server";

export const createPayment = internalMutation({
  args: {
    deliveryRequestId: v.id("deliveryRequests"),
    ref: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the delivery request exists
    const deliveryRequest = await ctx.db.get(args.deliveryRequestId);
    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }

    // Ensure the delivery request is in the correct status
    if (deliveryRequest.status !== "awaitingPayment") {
      throw new Error("Delivery request is not in awaitingPayment status");
    }

    // Create a payment record
    const payment = await ctx.db.insert("payments", {
      deliveryRequestId: args.deliveryRequestId,
      ref: args.ref,
      status: "pending", // Initial status
    });

    return payment;
  },
});

export const updatePaymentStatus = internalMutation({
  args: {
    ref: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("successful"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    // Fetch the payment record

    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("ref"), args.ref))
      .first();

    if (!payment) {
      return null;
    }
    if (payment.status === "successful") {
      return;
    }

    // Update the payment status
    await ctx.db.patch(payment._id, {
      status: args.status,
    });

    return { success: true };
  },
});

export const completePayment = internalMutation({
  args: {
    ref: v.string(),
  },

  handler: async (ctx, args) => {
    // Fetch the payment record
    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("ref"), args.ref))
      .first();

    if (!payment) {
      throw new Error("Payment not found");
    }

    const deliveryRequest = await ctx.db.get(payment.deliveryRequestId);
    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }
    if (deliveryRequest.status !== "awaitingPayment") {
      throw new Error("Delivery request is not in awaitingPayment status");
    }

    if (payment.status !== "pending") {
      throw new Error("Payment is not pending");
    }

    // Update the payment status to completed
    await ctx.db.patch(payment._id, {
      status: "successful",
    });
    await ctx.db.patch(payment.deliveryRequestId, {
      status: "assigningRider",
    });

    console.log("Payment completed successfully, assigning next rider...");

    await ctx.scheduler.runAfter(0, internal.lib.actions.map.assignNextRider, {
      deliveryRequestId: deliveryRequest._id,
    });

    return { success: true };
  },
});

export const cancelPayment = internalMutation({
  args: {
    ref: v.string(),
  },

  handler: async (ctx, args) => {
    // Fetch the payment record
    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("ref"), args.ref))
      .first();

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "pending") {
      throw new Error("Payment is not pending");
    }

    // Update the payment status to cancelled
    await ctx.db.patch(payment._id, {
      status: "failed",
    });

    return { success: true };
  },
});

export const withdrawPayment = mutation({
  args: {
    number: v.string(),
    amount: v.number(),
  },

  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const riderBalance = await ctx.runQuery(
      api.lib.queries.payments.riderBalance
    );
    if (riderBalance === null) {
      return null;
    }
    if (riderBalance.balance < args.amount) {
      throw new ConvexError({
        message: "Insufficient balance for withdrawal",
      });
    }
    await ctx.scheduler.runAfter(
      0,
      internal.lib.actions.payment.withdrawalPayment,
      {
        amount: args.amount,
        phoneNumber: args.number,
        riderId: userId,
      }
    );
  },
});
