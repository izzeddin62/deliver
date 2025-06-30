import { v } from "convex/values";
import { api, internal } from "../../_generated/api";
import { internalAction } from "../../_generated/server";

export const createDeliveryRequestFromFriend = internalAction({
  args: {
    friendLocationRequestId: v.id("friendLocationRequests"),
  },
  handler: async (ctx, { friendLocationRequestId }) => {
    const friendLocationRequest = await ctx.runQuery(
      internal.lib.queries.friends.acceptedFriendLocationRequest,
      {
        friendLocationRequestId,
      }
    );
    if (!friendLocationRequest) {
      throw new Error("Friend location request not found");
    }

    // Check if the request is pending
    if (friendLocationRequest.status !== "accepted") {
      throw new Error("Friend location request is not accepted yet");
    }

    const user = await ctx.runQuery(internal.lib.queries.users.user, {
      userId: friendLocationRequest.userId,
    });
    const friend = await ctx.runQuery(internal.lib.queries.users.user, {
      userId: friendLocationRequest.friendId,
    });

    if (!user?.location || !friend?.location) {
      throw new Error("location is not found");
    }

    const pickupLocationName = await ctx.runAction(
      api.lib.actions.map.getCurrentLocationDetails,
      {
        lat: user.location.latitude,
        lng: user.location.longitude,
      }
    );

    const destinationLocationName = await ctx.runAction(
      api.lib.actions.map.getCurrentLocationDetails,
      {
        lat: friend.location.latitude,
        lng: friend.location.longitude,
      }
    );
    if (!pickupLocationName || !destinationLocationName) {
      throw new Error("Unable to fetch location details");
    }

    // Create a new delivery request
    const newDeliveryRequest = await ctx.runMutation(
      internal.lib.mutations.deliveryRequests.createPendingDeliveryRequest,
      {
        userId: user._id,
        pickup: {
          name: pickupLocationName,
          latitude: user.location.latitude,
          longitude: user.location.longitude,
        },
        destination: {
          name: destinationLocationName,
          latitude: friend.location.latitude,
          longitude: friend.location.longitude,
        },
      }
    );
    if (!newDeliveryRequest) {
      throw new Error("Failed to create delivery request");
    }

    await ctx.runMutation(
      internal.lib.mutations.friends.deleteFriendLocationRequest,
      {
        friendLocationRequestId: friendLocationRequest._id,
      }
    );
  },
});
