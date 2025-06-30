import { cronJobs } from "convex/server";
import { internal } from "../../_generated/api";

const crons = cronJobs();

crons.interval(
  "verify payments",
  {
    minutes: 2,
  },
  internal.lib.actions.payment.verifyPayment
);
