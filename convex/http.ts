import { httpRouter } from "convex/server";
import { z } from "zod";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);
const paymentSchena = z.object({
  data: z.object({
    ref: z.string(),
    user_ref: z.string(),
    kind: z.string(),
    fee: z.number(),
    merchant: z.string(),
    client: z.string(),
    amount: z.number(),
    provider: z.string(),
    status: z.union([z.literal("successful"), z.literal("failed")]),
  }),
});

http.route({
  path: "/paypack",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("x-paypack-signature");
    const secret = process.env.PAYPACK_WEBHOOK_SIGN_KEY!;
    const bodyBuffer = await request.arrayBuffer();

    // Compute HMAC SHA-256 and encode as base64
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyBuffer);
    const computedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuffer))
    );

    if (computedSignature === signature) {
      const bodyText = new TextDecoder().decode(bodyBuffer);
      const jsonBody = JSON.parse(bodyText);
      console.log(jsonBody, "====== body");

      const { success, data: transaction } = paymentSchena.safeParse(jsonBody);

      if (!success) {
        return new Response("Invalid data", { status: 400 });
      }


      if (transaction.data.kind.toLowerCase() === "cashin") {
        if (transaction.data.status !== "successful") {
          await ctx.runMutation(internal.lib.mutations.payments.cancelPayment, {
            ref: transaction.data.ref,
          });
        } else {
          await ctx.runMutation(
            internal.lib.mutations.payments.completePayment,
            {
              ref: transaction.data.ref,
            }
          );
        }
      } else if (transaction.data.kind.toLowerCase() === "cashout") {
        if (transaction.data.status !== "successful") {
          await ctx.runMutation(
            internal.lib.mutations.withdrawals.cancelWithdrawal,
            {
              ref: transaction.data.ref,
            }
          );
        } else {
          await ctx.runMutation(
            internal.lib.mutations.withdrawals.completeWithdrawal,
            {
              ref: transaction.data.ref,
            }
          );
        }
      }
      // Signature is valid, process the webhook
      return new Response("Webhook verified", { status: 200 });
    } else {
      // Invalid signature
      return new Response("Invalid signature", { status: 401 });
    }
  }),
});

export default http;
