import { v } from "convex/values";
import { internalMutation } from "../../_generated/server";

export const createWithdrawal = internalMutation({
  args: {
    amount: v.number(),
    riderId: v.id("users"),
    phoneNumber: v.string(),
    ref: v.string(), // Reference for the withdrawal
  },
  handler: async (ctx, { amount, riderId, ref, phoneNumber }) => {
    // Create a withdrawal record
    const withdrawal = await ctx.db.insert("withdrawals", {
      amount,
      riderId,
      status: "pending", // Initial status
      phoneNumber,
      ref, // Store the reference
    });

    return { withdrawal };
  },
});

export const completeWithdrawal = internalMutation({
  args: {
    ref: v.string(),
  },
  handler: async (ctx, { ref }) => {
    // Fetch the withdrawal record
    const withdrawal = await ctx.db
      .query("withdrawals")
      .filter((q) => q.eq(q.field("ref"), ref))
      .first();
    if (!withdrawal) {
      throw new Error("Withdrawal not found");
    }

    // Update the withdrawal status to completed
    await ctx.db.patch(withdrawal._id, {
      status: "successful",
    });

    return { success: true };
  },
});

export const cancelWithdrawal = internalMutation({
  args: {
    ref: v.string(),
  },
  handler: async (ctx, { ref }) => {
    // Fetch the withdrawal record
    const withdrawal = await ctx.db
      .query("withdrawals")
      .filter((q) => q.eq(q.field("ref"), ref))
      .first();
    if (!withdrawal) {
      throw new Error("Withdrawal not found");
    }

    // Update the withdrawal status to cancelled
    await ctx.db.patch(withdrawal._id, {
      status: "failed",
    });

    return { success: true };
  },
});
