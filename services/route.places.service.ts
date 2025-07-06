import axios from "axios";

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Waypoint {
  location: {
    latLng: LatLng;
  };
}
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

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
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

export async function fetchComputedRoutes(
  body: ComputeRoutesRequest
): Promise<ComputeRoutesResponse> {
  const response = await api.post<ComputeRoutesResponse>("", body);
  return response.data;
}

export type _WAZEAddressData = {
  name: string;
  cleanName: string;
  address: string;
  venueId: string;
  latLng: {
    lat: number;
    lng: number;
  };
};
