import { getAuthUserId } from "@convex-dev/auth/server";
import axios from "axios";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";
import { action, internalAction } from "../../_generated/server";
import { calculateDeliveryCost } from "../../utils/cost";


export interface LatLng {
  latitude: number;
  longitude: number;
}

const CLatLng = v.object({
  latitude: v.number(),
  longitude: v.number(),
});

export interface Waypoint {
  location: {
    latLng: LatLng;
  };
}

const CWaypoint = v.object({
  location: v.object({
    latLng: CLatLng,
  }),
});
export const CComputeRoutesRequest = v.object({
  origin: CWaypoint,
  destination: CWaypoint,
  travelMode: v.optional(v.union(v.literal("DRIVE"), v.literal("TWO_WHEELER"), v.literal("BICYCLE"), v.literal("WALK"))),
  routingPreference: v.optional(v.union(v.literal("TRAFFIC_AWARE"), v.literal("UNRESTRICTED"))),
  polylineQuality: v.optional(v.union(v.literal("HIGH_QUALITY"), v.literal("OVERVIEW"))),
  polylineEncoding: v.optional(v.literal("ENCODED_POLYLINE")),
  intermediates: v.optional(v.array(CWaypoint)),
});
export interface ComputeRoutesRequest {
  origin: Waypoint;
  destination: Waypoint;
  travelMode?: "DRIVE" | "TWO_WHEELER" | "BICYCLE" | "WALK";
  routingPreference?: "TRAFFIC_AWARE" | "UNRESTRICTED";
  polylineQuality?: "HIGH_QUALITY" | "OVERVIEW";
  polylineEncoding?: "ENCODED_POLYLINE";
  intermediates?: Waypoint[];
}
export interface Route {
  duration: string;
  distanceMeters: number;
  polyline: { encodedPolyline: string };
}
export interface ComputeRoutesResponse {
  routes: Route[];
}

type AddressResponse = {
  results: {
    formatted_address: string;
  }[];
};

export const getCurrentLocationDetails = action({
  args: { lat: v.number(), lng: v.number() },
  handler: async (ctx, args: { lat: number; lng: number }) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${args.lat},${args.lng}&key=${apiKey}`;
    const { data } = await axios.get<AddressResponse>(url);
    return data?.results?.[0].formatted_address ?? null;
  },
});

const API_KEY = process.env.GOOGLE_API_KEY;
const ENDPOINT = "https://routes.googleapis.com/directions/v2:computeRoutes";
const api = axios.create({
  baseURL: ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask":
      "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
  },
});

export const fetchComputedRoutes = action({
  args: { data: CComputeRoutesRequest },
  handler: async (
    ctx,
    args: {
      data: ComputeRoutesRequest;
    }
  ): Promise<ComputeRoutesResponse | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const body = args;
    const { data } = await api.post<ComputeRoutesResponse>("", body);
    return data;
  },
});


export const calculatePriceAndDistance = internalAction({
  args: {
    data: CComputeRoutesRequest,
    deliveryId: v.id('deliveryRequests'),
  },
  handler: async (ctx, args: { data: ComputeRoutesRequest, deliveryId: Id<"deliveryRequests"> }) => {
    const body = args.data;
    const { data } = await api.post<ComputeRoutesResponse>("", body);

    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    const distanceInMeters = route.distanceMeters;
    const duration = route.duration;

    const price = calculateDeliveryCost(distanceInMeters);

    await ctx.runMutation(internal.lib.mutations.deliveryRequests.updateDeliveryPriceDistanceAndDuration, {
      deliveryId: args.deliveryId,
      distanceMeters: distanceInMeters,
      duration: duration,
      price: price,
    })


   
  },
})


export const assignNextRider = internalAction({
  args: { deliveryRequestId: v.id("deliveryRequests") },
  handler: async (ctx, args) => {

    console.log("I assign next rider for delivery request", args.deliveryRequestId);
   
    const deliveryRequest = await ctx.runQuery(internal.lib.queries.deliveryRequests.deliveryRequest, {
      deliveryRequestId: args.deliveryRequestId,
    })
    if (!deliveryRequest || deliveryRequest.status !== "assigningRider") return;

    // 1. Query free riders

    const freeRiders = await ctx.runQuery(internal.lib.queries.riders.freeRiders, {
      deliveryRequestId: args.deliveryRequestId,
    });
    console.log("Free riders found:", freeRiders.length);
    if (freeRiders.length === 0) return;

    // 2. Prepare Distance Matrix API call
    const origins = freeRiders.map(rider => `${rider.location?.latitude},${rider.location?.longitude}`).join("|");
    const dest = `${deliveryRequest.pickup.latitude},${deliveryRequest.pickup.longitude}`;
    const API_KEY = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${dest}&key=${API_KEY}`;
    const { data } = await axios.get(url);


 

    // 3. Pair riders with travel time
    const ridersWithTime = freeRiders.map((rider, i) => ({
      rider,
      duration: data.rows[i].elements[0].duration.value
    }));

    // 4. Sort by duration
    ridersWithTime.sort((a, b) => a.duration - b.duration);
    console.log("Sorted riders by travel time:", ridersWithTime.map(r => [r.rider._id.toString(), r.duration]));

    // 5. Pick the closest rider not yet tried
    const nextRider = ridersWithTime[0];
    console.log("Assigning rider:", nextRider.rider._id.toString(), "with duration:", nextRider.duration);
  

    await ctx.runMutation(internal.lib.mutations.deliveryAssignments.createRiderAssignment, {
      deliveryId: args.deliveryRequestId,
      riderId: nextRider.rider._id
    })
    console.log("Rider assignment created for delivery request:", args.deliveryRequestId);

    // // 7. Send notification to rider
    // await ctx.functions.sendPushNotification({
    //   riderId: next.rider.id,
    //   requestId,
    //   type: "NewAssignment"
    // });
  }
});
