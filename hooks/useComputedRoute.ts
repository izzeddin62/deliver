import {
    ComputeRoutesResponse,
    fetchComputedRoutes,
    LatLng,
} from "@/services/route.places.service";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useComputeRoutes(
  origin: LatLng,
  destination: LatLng,
  options?: UseQueryOptions<ComputeRoutesResponse, Error>
) {
  return useQuery<ComputeRoutesResponse, Error>({
    queryKey: ["routes", origin, destination],
    queryFn: () =>
      fetchComputedRoutes({
        origin: { location: { latLng: origin } },
        destination: { location: { latLng: destination } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        polylineQuality: "HIGH_QUALITY",
        polylineEncoding: "ENCODED_POLYLINE",
      }),
    enabled: Boolean(origin && destination),
    ...options,
  });
}
