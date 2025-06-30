import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../../_generated/server";

// Create a new profile
export const addProfile = mutation({
  args: { firstName: v.string(), lastName: v.string() },
  handler: async (ctx, { firstName, lastName }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (profile) {
      throw new Error("Profile already exists");
    }
    const newProfile = await ctx.db.insert("profiles", {
      firstName,
      lastName,
      userId,
    });
    return {
      profile: newProfile,
    };
  },
});

export const updateUserType = mutation({
  args: { type: v.union(v.literal("user"), v.literal("rider")) },
  async handler(ctx, { type }) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    if (user.type) throw new Error("User already have a type");
    await ctx.db.patch(userId, {
      type,
    });
    return {
        success: true
    }
  },
});


export const updateRiderLocation = mutation({
  args: {
    location: v.union(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
      v.null()
    ),
  },
  async handler(ctx, { location }) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    await ctx.db.patch(userId, {
      location: location ?? undefined,
    });
    return {
      success: true,
    };
  },
});


export const startDelivery = mutation({
  args: {
    deliveryId: v.id("deliveryRequests"),
  },
  async handler(ctx, { deliveryId }) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const deliveryRequest = await ctx.db.get(deliveryId);
    if (!deliveryRequest) {
      throw new Error("Delivery request not found");
    }

    if (deliveryRequest.riderId !== userId) {
      throw new Error("Unauthorized to start this delivery");
    }

    await ctx.db.patch(deliveryId, {
      status: "delivering",
    });

    return {
      success: true,
    };
  }
});
