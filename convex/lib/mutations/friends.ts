import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../../_generated/api";
import { internalMutation, mutation } from "../../_generated/server";

export const addFriend = mutation({
  args: { friendId: v.id("users") },
  async handler(ctx, { friendId }) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if the user already exists
    const existingUser = await ctx.db.get(friendId);
    const user = await ctx.db.get(userId);
    const existingFriend = await ctx.db
      .query("friends")
      .filter(
        (q) =>
          (q.eq(q.field("userId"), userId) &&
            q.eq(q.field("friendId"), friendId)) ||
          (q.eq(q.field("userId"), friendId) &&
            q.eq(q.field("friendId"), userId))
      )
      .first();
    if (!user) {
      throw new ConvexError({
        message: "User not found",
      });
    }

    if (!existingUser) {
      throw new ConvexError({
        message: "friend not found",
      });
    }
    if (existingUser._id === userId) {
      throw new ConvexError({
        message: "You cannot add yourself as a friend",
      });
    }
    if (existingUser.type !== "user") {
      throw new ConvexError({
        message: "Rider can not add friends",
      });
    }
    if (existingUser.type !== "user") {
      throw new ConvexError({
        message: "You can only add users as friends",
      });
    }
    if (existingFriend) {
      return { message: "Friend already exists", success: false };
    }

    // Add friend relationship
    await ctx.db.insert("friends", {
      userId,
      friendId,
    });

    return {
      success: true,
      message: "Friend added successfully",
    };
  },
});

export const createFriendLocationRequest = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, { friendId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if the friend exists
    const existingFriend = await ctx.db.get(friendId);
    if (!existingFriend) {
      throw new ConvexError({
        message: "Friend not found",
      });
    }

    const existingfriendship1 = await ctx.db
      .query("friends")
      .filter(
        (q) =>
          q.eq(q.field("userId"), userId) && q.eq(q.field("friendId"), friendId)
      )
      .unique();

    // Check if the friend is already a friend
    const existingFriendship = await ctx.db
      .query("friends")
      .filter(
        (q) =>
          q.eq(q.field("userId"), friendId) && q.eq(q.field("friendId"), userId)
      )
      .unique();
    console.log(existingFriendship, "===== friendship");
    if (!existingFriendship && !existingfriendship1) {
      throw new ConvexError({
        message: "You can only send location requests to friends",
      });
    }

    // Check if a pending request already exists
    const existingRequest = await ctx.db
      .query("friendLocationRequests")
      .withIndex("by_friendId", (q) => q.eq("friendId", friendId))

      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();
    if (existingRequest) {
      throw new ConvexError({
        message: "You have already sent a location request to this friend",
      });
    }
    // Create the friend location request
    const request = await ctx.db.insert("friendLocationRequests", {
      userId,
      friendId,
      status: "pending",
    });

    return { request };
  },
});

export const acceptFriendLocationRequest = mutation({
  args: {
    requestId: v.id("friendLocationRequests"),
  },
  handler: async (ctx, { requestId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if the request exists
    const request = await ctx.db.get(requestId);
    if (!request) {
      throw new ConvexError({
        message: "Request not found",
      });
    }

    // Check if the user is the friend of the request
    if (request.friendId !== userId) {
      throw new ConvexError({
        message: "You can only accept requests sent to you",
      });
    }

    // Update the request status to accepted
    await ctx.db.patch(request._id, { status: "accepted" });
    await ctx.scheduler.runAfter(
      0,
      internal.lib.actions.deliveryRequest.createDeliveryRequestFromFriend,
      {
        friendLocationRequestId: request._id,
      }
    );

    return { success: true };
  },
});

export const rejectFriendLocationRequest = mutation({
  args: {
    requestId: v.id("friendLocationRequests"),
  },
  handler: async (ctx, { requestId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if the request exists
    const request = await ctx.db.get(requestId);
    if (!request) {
      throw new ConvexError({
        message: "Request not found",
      });
    }

    // Check if the user is the friend of the request
    if (request.friendId !== userId) {
      throw new ConvexError({
        message: "You can only reject requests sent to you",
      });
    }

    // Update the request status to rejected
    await ctx.db.patch(request._id, { status: "rejected" });

    return { success: true };
  },
});



export const deleteFriendLocationRequest = internalMutation({
  args: {
    friendLocationRequestId: v.id("friendLocationRequests"),
  },
  handler: async (ctx, { friendLocationRequestId }) => {
    const request = await ctx.db.get(friendLocationRequestId);
    if (!request) {
      throw new Error("Friend location request not found");
    }

    await ctx.db.delete(friendLocationRequestId);
    return { success: true };
  },
});
