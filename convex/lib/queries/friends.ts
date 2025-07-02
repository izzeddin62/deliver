import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  internalQuery,
  query
} from "../../_generated/server";

export const friends = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Fetch friends of the current user
    const friendsList = await ctx.db
      .query("friends")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    const otherFriendsList = await ctx.db
      .query("friends")
      .withIndex("by_friendId", (q) => q.eq("friendId", userId))
      .collect();

    // Fetch friend details
    const friendDetails = await Promise.all([
      ...friendsList.map(async (friend) => {
        const friendData = await ctx.db.get(friend.friendId);
        if (!friendData) return null;
        return friendData;
      }),
      ...otherFriendsList.map(async (friend) => {
        const friendData = await ctx.db.get(friend.userId);
        if (!friendData) return null;

        return friendData;
      }),
    ]);

    const finalFriendDetails = friendDetails.filter((f) => f !== null);

    // Combine both lists

    return {
      friends: finalFriendDetails,
    };
  },
});

export const friendLocationRequest = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const request = await ctx.db
      .query("friendLocationRequests")
      .withIndex("by_friendId", (q) => q.eq("friendId", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();
    const friend = request ? await ctx.db.get(request.userId) : null;

    return {
      request,
      friend: friend
        ? {
            ...friend,
            location: request?.status === "accepted" ? friend.location : undefined,
          }
        : null,
    };
  },
});

export const sentFriendLocationRequest = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const request = await ctx.db
      .query("friendLocationRequests")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();
    const friend = request ? await ctx.db.get(request.friendId) : null;

    return {
      request: request,
      friend: friend,
    };
  },
});

export const acceptedFriendLocationRequest = internalQuery({
  args: {
    friendLocationRequestId: v.id("friendLocationRequests"),
  },
  handler: async (ctx, { friendLocationRequestId }) => {
    return ctx.db.get(friendLocationRequestId);
  },
});

