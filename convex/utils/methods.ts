"use strict";

import http from "./payment";
import {
    PaypackCashinResponse,
    PaypackCashoutResponse,
    PaypackEventsResponse,
    PaypackProfileResponse,
    PaypackTransactionResponse,
    PaypackTransactionsResponse,
} from "./types";
import * as utils from "./util";

export class Paypack {
  constructor(config: { client_id: string; client_secret: string }) {
    if (config) utils.setSecrets(config);
  }
  static config(config: { client_id: string; client_secret: string }) {
    if (this instanceof Paypack) {
      utils.setSecrets(config);
      return this;
    } else {
      return new Paypack(config);
    }
  }

  /**
   * Fetch transactions according to filter parameters
   *
   * @property {string} limit limit of transactions to fetch default is 20
   * @property {string} offset offset of transactions to fetch
   * @property {string} from starting date range of transactions to fetch
   * @property {string} to ending date range of transactions to fetch
   * @property {string} kind kind of transactions to fetch eg: CASHIN or CASHOUT
   * @property {number} client transactions for a specific client
   *
   * @return {object}
   */
  async transactions(filters: {
    limit: string;
    offset: string;
    from: string;
    to: string;
    kind: string;
    client: number;
  }): Promise<PaypackTransactionsResponse> {
    return await new Promise(async (resolve, reject) => {
      try {
        const res = await http.get(
          "transactions/list?".concat(utils.getQueryString(filters))
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Fetch transaction according to the transaction ref
   *
   * @param {string} ref transaction ref
   *
   * @return {object}
   */
  async transaction(ref: string): Promise<PaypackTransactionResponse> {
    return await new Promise(async (resolve, reject) => {
      try {
        if (!ref) {
          throw new Error("Transaction ref is required to fetch transaction");
        }
        if (typeof ref != "string") {
          throw new TypeError("Transaction reference must be a string type");
        }
        const res = await http.get("transactions/find/".concat(ref));
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Initiates a cashin.
   *
   * @property {string} amount amount to cashin
   * @property {number} number phone number to cashin
   *
   * @return {object}
   */
  async cashin(params: {
    amount: number;
    number: string;
    environment: "development" | "production" | null;
  }): Promise<PaypackCashinResponse> {
    return await new Promise(async (resolve, reject) => {
      try {
        let { amount, number, environment = null } = params;
        let headers: Record<string, string> = {
          accept: "application/json",
          "Content-Type": "application/json",
        };
        if (environment != null) headers["X-Webhook-Mode"] = environment;
        if (amount < 100) {
          throw new Error("Minimum to cashin is 100 RWF");
        }
        if (!utils.isPhoneNumber(number)) {
          throw new Error("Invalid phone number");
        }
        const res = await http.post(
          "transactions/cashin",
          {
            amount,
            number,
          },
          {
            headers,
          }
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Initiates a cashout request.
   *
   * @property {string} amount amount to cashout
   * @property {number} number phone number to cashout
   *
   * @return {object}
   */
  async cashout(params: {
    amount: number;
    number: string;
    environment: "development" | "production" | null;
  }): Promise<PaypackCashoutResponse> {
    return await new Promise(async (resolve, reject) => {
      try {
        let { amount, number, environment = null } = params;
        let headers: Record<string, string> = {
          accept: "application/json",
          "Content-Type": "application/json",
        };
        if (environment != null) headers["X-Webhook-Mode"] = environment;
        if (amount < 100) {
          throw new Error("Minimum to cashout is 100 RWF");
        }
        if (!utils.isPhoneNumber(number)) {
          throw new Error("Invalid phone number");
        }
        const res = await http.post(
          "transactions/cashout",
          {
            amount,
            number,
          },
          {
            headers,
          }
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Fetch events according to filter parameters.
   *
   * @property {string} limit limit of events to fetch default is 20
   * @property {string} offset offset of events to fetch
   * @property {string} from starting date range of events to fetch
   * @property {string} to ending date range of events to fetch
   * @property {string} kind kind of events to fetch eg: CASHIN or CASHOUT
   * @property {number} client events for a specific client
   * @property {string} ref events for a specific transaction ref
   * @property {string} status events with a specific status eg: pending or successfull or failed
   *
   * @return {object}
   */
  async events(filters: {
    limit?: string;
    offset?: string;
    from?: string;
    to?: string;
    kind?: string;
    client?: number;
    ref?: string;
    status?: string;
  }): Promise<PaypackEventsResponse> {
    return await new Promise(async (resolve, reject) => {
      try {
        const res = await http.get(
          "events/transactions?".concat(utils.getQueryString(filters))
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Provides a profile of authenticated user.
   *
   * @return {object}
   */
  async me(): Promise<PaypackProfileResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await http.get("merchants/me");
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }
}

//# sourceMappingURL=methods.js.map
