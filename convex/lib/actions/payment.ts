import { AxiosError } from "axios";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";
import { Paypack } from "../../utils/methods";

const paypack = new Paypack({
  client_id: process.env.PAYPACK_CLIENT_ID!,
  client_secret: process.env.PAYPACK_CLIENT_SECRET!,
});

export const requestPayment = internalAction({
  args: {
    deliveryRequestId: v.id("deliveryRequests"),
  },
  handler: async (ctx, args) => {
    // Fetch the delivery request to ensure it exists and belongs to the user
    const deliveryRequest = await ctx.runQuery(
      internal.lib.queries.deliveryRequests.deliveryRequest,
      {
        deliveryRequestId: args.deliveryRequestId,
      }
    );

    console.log(deliveryRequest, "i am trying to pay");

    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }
    if (deliveryRequest.status !== "awaitingPayment") {
      throw new Error("Delivery request is not in awaitingPayment status");
    }
    console.log("I am here right now, I got to the payment");
    console.log(paypack, "===== paypack");
    console.log(paypack.cashin);
    try {
      const { data } = await paypack.cashin({
        amount: 100,
        number: "0784088507",
        environment: "development",
      });

      console.log(data, "the payment data I received");

      await ctx.runMutation(internal.lib.mutations.payments.createPayment, {
        deliveryRequestId: args.deliveryRequestId,
        ref: data.ref,
      });
    } catch (error) {
      console.log(error, "======");
      if (error instanceof AxiosError) {
        console.log(error.response?.data, "===== the data");
      }
      throw error;
    }
  },
});

export const verifyPayment = internalAction({
  handler: async (ctx) => {
    // Fetch the payment record

    // Verify the payment using Paypack
    const { data } = await paypack.events({
      status: "successful",
    });

    console.log("Payment verification data:", data);

    const transactions = data.transactions;

    console.log(
      "Transactions to verify:",
      transactions.map((el) => el.data)
    );

    await Promise.all(
      transactions.map(async (transaction) => {
        return ctx.runMutation(
          internal.lib.mutations.payments.updatePaymentStatus,
          {
            ref: transaction.data.ref,
            status: "successful",
          }
        );
      })
    );

    return { success: true };
  },
});

export const withdrawalPayment = internalAction({
  args: {
   amount: v.number(),
    phoneNumber: v.string(),
    riderId: v.id("users"),
  },
  handler: async (ctx, { amount, phoneNumber, riderId }) => {
    // Fetch the withdrawal request to ensure it exists

    // Verify the payment using Paypack
    const { data } = await paypack.cashout({
      amount,
      number: phoneNumber,
      environment: "development",
    });

    console.log(data, "the withdrawal data I received");

    await ctx.runMutation(
      internal.lib.mutations.withdrawals.createWithdrawal,
      {
        amount,
        phoneNumber,
        riderId,
        ref: data.ref,
      }
    );

    return { success: true };
  },
});
