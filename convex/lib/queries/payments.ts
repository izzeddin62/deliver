import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalQuery, query } from "../../_generated/server";

export const payment = internalQuery({
  args: {
    deliveryRequestId: v.id("deliveryRequests"),
    ref: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch the payment record for the given delivery request
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_deliveryRequestId", (q) =>
        q.eq("deliveryRequestId", args.deliveryRequestId)
      )
      .filter((q) => q.eq(q.field("ref"), args.ref))
      .first();

    if (!payment) {
      throw new Error("Payment not found for the specified delivery request");
    }

    return payment;
  },
});

export const riderBalance = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Fetch the total amount of payments made by the rider
    const deliveryRequests = await ctx.db
      .query("deliveryRequests")
      .filter(
        (q) =>
          q.eq(q.field("riderId"), userId) && q.eq(q.field("status"), "done")
      )
      .collect();

    // 2. For each delivery request, get the payment(s)
    const payments = (
      await Promise.all(
        deliveryRequests.map(async (request) => {
          return await ctx.db
            .query("payments")
            .withIndex("by_deliveryRequestId", (q) =>
              q.eq("deliveryRequestId", request._id)
            )
            .collect();
        })
      )
    ).flat();

    const balance = payments.reduce((acc, payment) => {
      if (payment.status === "successful") {
        const delivery = deliveryRequests.find(
          (req) => req._id === payment.deliveryRequestId
        );
        if (!delivery) {
          return acc;
        }
        if (!delivery.price) {
          return acc;
        }
        return acc + delivery.price;
      }
      return acc;
    }, 0);

    const withdrawal = await ctx.db
      .query("withdrawals")
      .withIndex("by_riderId", (q) => q.eq("riderId", userId))
      .order("desc")

      .filter((q) => q.eq(q.field("status"), "successful"))
      .collect();

      const withdrawnAmount = withdrawal.reduce((acc, w) => acc + w.amount, 0);
      const finalBalance = balance - withdrawnAmount;

    return { balance: finalBalance };
  },
});
