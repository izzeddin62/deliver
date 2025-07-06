import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";

import FinalWaitingSheet from "@/components/sheets/FinalWaitingSheet";
import RideAssignmentSheet from "@/components/sheets/RideAssignmentSheet";
import RiderHandoffSheet from "@/components/sheets/RiderHandoffSheet";
import WaitingUserInfoSheet from "@/components/sheets/WaitingUserInfoSheet";
import { Box } from "@/components/ui/box";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useComputeRoutes } from "@/hooks/useComputedRoute";
import polyline from "@mapbox/polyline";
import { useQuery } from "convex/react";
import duration from "dayjs/plugin/duration";
import * as Location from "expo-location";
import { Redirect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";

dayjs.extend(duration);

export default function UserMapScreen() {
  // ——— STATE HOOKS ———
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentMarker, setCurrentMarker] = useState<LatLng | null>(null);
  const deliveryInfo = useQuery(
    api.lib.queries.riderAssignment.riderAssignment
  );
  const { data, isPending } = useComputeRoutes(
    deliveryInfo?.deliveryRequest?.status === "delivering"
      ? {
          latitude: deliveryInfo.deliveryRequest.pickup.latitude,
          longitude: deliveryInfo.deliveryRequest.pickup.longitude,
        }
      : currentMarker,
    deliveryInfo?.deliveryRequest?.destination
      ? {
          longitude: deliveryInfo?.deliveryRequest?.destination.longitude,
          latitude: deliveryInfo?.deliveryRequest?.destination.latitude,
        }
      : null,
    deliveryInfo?.deliveryRequest?.status === "delivering"
      ? []
      : deliveryInfo?.deliveryRequest?.pickup
        ? [
            {
              longitude: deliveryInfo?.deliveryRequest?.pickup.longitude,
              latitude: deliveryInfo.deliveryRequest.pickup.latitude,
            },
          ]
        : []
  );

  // ——— EFFECT TO REQUEST LOCATION PERMISSION + GET CURRENT POSITION ———
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to use this feature."
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Define an initial region centered on user's location
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setCurrentMarker({ latitude, longitude });
    })();
  }, []);

  const coords =
    data?.routes?.[0] && data.routes[0]?.polyline?.encodedPolyline
      ? polyline
          .decode(data.routes[0].polyline.encodedPolyline)
          .map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
      : null;

  if (deliveryInfo === null) {
    return <Redirect href={"/login"} />;
  }

  if (!deliveryInfo) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }

  const { deliveryRequest, riderAssignment } = deliveryInfo;

  const currentRegion =
    deliveryRequest?.pickup.latitude && deliveryRequest?.pickup.longitude
      ? {
          latitude: deliveryRequest?.pickup.latitude,
          longitude: deliveryRequest?.pickup.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : undefined;

  const isDeliveryRequestActive =
    deliveryInfo.deliveryRequest?.status !== "done";

  console.log(coords?.length, "==== rider route coords");

  console.log({ hello: "56" });

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1">
        <Box className="flex-1">
          {initialRegion && (isPending || !data) && (
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={currentRegion ?? initialRegion}
              showsUserLocation={true}
              loadingEnabled
              region={currentRegion ?? initialRegion}
            ></MapView>
          )}
          {initialRegion &&
            deliveryRequest?.status === "inTransit" &&
            coords && (
              <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={currentRegion ?? initialRegion}
                showsUserLocation={true}
                loadingEnabled
                region={currentRegion ?? initialRegion}
              >
                {deliveryInfo.deliveryRequest?.pickup &&
                  deliveryInfo.deliveryRequest.status !== "done" && (
                    <Marker
                      coordinate={{
                        latitude: deliveryInfo.deliveryRequest.pickup.latitude,
                        longitude:
                          deliveryInfo.deliveryRequest.pickup.longitude,
                      }}
                      title="Destination"
                    />
                  )}

                {deliveryInfo.deliveryRequest?.destination &&
                  coords &&
                  deliveryInfo.deliveryRequest.status !== "done" && (
                    <Marker
                      coordinate={{
                        latitude:
                          deliveryInfo.deliveryRequest.destination.latitude,
                        longitude:
                          deliveryInfo.deliveryRequest.destination.longitude,
                      }}
                      title="Destination"
                    />
                  )}

                <Polyline
                  key={coords
                    .map((c) => `${c.latitude},${c.longitude}`)
                    .join(";")}
                  coordinates={coords.slice(5)}
                  strokeColor="#0da6f2"
                  strokeWidth={6}
                />
              </MapView>
            )}

          {initialRegion &&
            deliveryRequest?.status === "delivering" &&
            coords && (
              <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={currentRegion ?? initialRegion}
                showsUserLocation={true}
                loadingEnabled
                region={currentRegion ?? initialRegion}
              >
                {deliveryInfo.deliveryRequest?.pickup &&
                  deliveryInfo.deliveryRequest.status !== "done" && (
                    <Marker
                      coordinate={{
                        latitude: deliveryInfo.deliveryRequest.pickup.latitude,
                        longitude:
                          deliveryInfo.deliveryRequest.pickup.longitude,
                      }}
                      title="Destination"
                    />
                  )}

                {deliveryInfo.deliveryRequest?.destination &&
                  coords &&
                  deliveryInfo.deliveryRequest.status !== "done" && (
                    <Marker
                      coordinate={{
                        latitude:
                          deliveryInfo.deliveryRequest.destination.latitude,
                        longitude:
                          deliveryInfo.deliveryRequest.destination.longitude,
                      }}
                      title="Destination"
                    />
                  )}

                <Polyline
                  key={coords
                    .map((c) => `${c.latitude},${c.longitude}`)
                    .join(";")}
                  coordinates={coords.slice(5)}
                  strokeColor="#0da6f2"
                  strokeWidth={6}
                />
              </MapView>
            )}

          {/* ===== MAPVIEW ===== */}
        </Box>

        {isDeliveryRequestActive &&
          riderAssignment?.response === "pending" &&
          deliveryRequest && (
            <RideAssignmentSheet
              deliveryRequest={deliveryRequest}
              assignment={riderAssignment}
            />
          )}

        {riderAssignment?.response === "accepted" &&
          deliveryRequest?.status === "inTransit" &&
          riderAssignment &&
          deliveryInfo.requester && (
            <WaitingUserInfoSheet
              deliveryRequest={deliveryRequest}
              requester={deliveryInfo.requester}
            />
          )}
        {riderAssignment?.response === "accepted" &&
          deliveryRequest?.status === "delivering" &&
          deliveryRequest && (
            <RiderHandoffSheet deliveryRequest={deliveryRequest} />
          )}

        {riderAssignment?.response === "accepted" &&
          deliveryRequest?.status === "handoff" && <FinalWaitingSheet />}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
