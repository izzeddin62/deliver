/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ResendOTP from "../ResendOTP.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as lib_actions_deliveryRequest from "../lib/actions/deliveryRequest.js";
import type * as lib_actions_map from "../lib/actions/map.js";
import type * as lib_actions_payment from "../lib/actions/payment.js";
import type * as lib_mutations_deliveryAssignments from "../lib/mutations/deliveryAssignments.js";
import type * as lib_mutations_deliveryRequests from "../lib/mutations/deliveryRequests.js";
import type * as lib_mutations_friends from "../lib/mutations/friends.js";
import type * as lib_mutations_payments from "../lib/mutations/payments.js";
import type * as lib_mutations_user from "../lib/mutations/user.js";
import type * as lib_mutations_withdrawals from "../lib/mutations/withdrawals.js";
import type * as lib_queries_deliveryRequests from "../lib/queries/deliveryRequests.js";
import type * as lib_queries_friends from "../lib/queries/friends.js";
import type * as lib_queries_payments from "../lib/queries/payments.js";
import type * as lib_queries_riderAssignment from "../lib/queries/riderAssignment.js";
import type * as lib_queries_riders from "../lib/queries/riders.js";
import type * as lib_queries_users from "../lib/queries/users.js";
import type * as lib_queries_withdrawals from "../lib/queries/withdrawals.js";
import type * as lib_schedulers_payments from "../lib/schedulers/payments.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";
import type * as utils_cost from "../utils/cost.js";
import type * as utils_methods from "../utils/methods.js";
import type * as utils_payment from "../utils/payment.js";
import type * as utils_types from "../utils/types.js";
import type * as utils_util from "../utils/util.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  auth: typeof auth;
  crons: typeof crons;
  http: typeof http;
  "lib/actions/deliveryRequest": typeof lib_actions_deliveryRequest;
  "lib/actions/map": typeof lib_actions_map;
  "lib/actions/payment": typeof lib_actions_payment;
  "lib/mutations/deliveryAssignments": typeof lib_mutations_deliveryAssignments;
  "lib/mutations/deliveryRequests": typeof lib_mutations_deliveryRequests;
  "lib/mutations/friends": typeof lib_mutations_friends;
  "lib/mutations/payments": typeof lib_mutations_payments;
  "lib/mutations/user": typeof lib_mutations_user;
  "lib/mutations/withdrawals": typeof lib_mutations_withdrawals;
  "lib/queries/deliveryRequests": typeof lib_queries_deliveryRequests;
  "lib/queries/friends": typeof lib_queries_friends;
  "lib/queries/payments": typeof lib_queries_payments;
  "lib/queries/riderAssignment": typeof lib_queries_riderAssignment;
  "lib/queries/riders": typeof lib_queries_riders;
  "lib/queries/users": typeof lib_queries_users;
  "lib/queries/withdrawals": typeof lib_queries_withdrawals;
  "lib/schedulers/payments": typeof lib_schedulers_payments;
  upload: typeof upload;
  users: typeof users;
  "utils/cost": typeof utils_cost;
  "utils/methods": typeof utils_methods;
  "utils/payment": typeof utils_payment;
  "utils/types": typeof utils_types;
  "utils/util": typeof utils_util;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
