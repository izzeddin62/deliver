import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import AssignRiderSheet from "@/components/sheets/AssignRiderSheet";
import PayDeliveryRequestSheet from "@/components/sheets/PayDeliveryRequestSheet";
import WaitingForPaymentSheet from "@/components/sheets/WaitingForPaymentSheet";
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
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import MotoTaxiMarker from "../markers/MotoTaxiMarker";
import DeliveryProgressSheet from "../sheets/DeliveryProgressSheet";
import HandoffSheet from "../sheets/HandoffSheet";
import WaitingRiderSheet from "../sheets/WaitingRiderSheet";

dayjs.extend(duration);
export default function ActiveDelivery() {
  const activeData = useQuery(
    api.lib.queries.deliveryRequests.ActiveDeliveryRequest
  );
  const delivery = activeData?.deliveryRequest;

  const rider = activeData?.rider;

  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

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
    })();
  }, []);

  const { data, isLoading } = useComputeRoutes(
    delivery?.pickup
      ? {
          latitude: delivery.pickup.latitude,
          longitude: delivery?.pickup.longitude,
        }
      : null,
    delivery?.destination
      ? {
          latitude: delivery.destination.latitude,
          longitude: delivery?.destination.longitude,
        }
      : null,
    null
  );
  const coords = data?.routes?.[0]
    ? polyline
        .decode(data.routes[0].polyline.encodedPolyline)
        .map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
    : null;

  if (!delivery || delivery.status === "done") {
    return <Redirect href="/(app)/user" />;
  }

  const currentRegion = {
    latitude: delivery.pickup.latitude,
    longitude: delivery.pickup.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }
  console.log(delivery.status, activeData.riderProfile, "-===== data");
  return (
    <GestureHandlerRootView>
      <Box className="flex-1">
        <Box className="flex-1 h-40">
          {initialRegion && (
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={initialRegion}
              showsUserLocation={true}
              loadingEnabled
              region={currentRegion ?? initialRegion}
            >
              {delivery?.destination && (
                <Marker
                  coordinate={{
                    longitude: delivery.destination.longitude,
                    latitude: delivery.destination.latitude,
                  }}
                  title="Destination"
                />
              )}

              {rider && rider.location && delivery.status === "delivering" && (
                // <Marker
                //   coordinate={{
                //     longitude: rider.location.longitude,
                //     latitude: rider.location.latitude,
                //   }}
                //   title="Rider Location"
                //   pinColor="#0da6f2"
                // >
                //   <BikeIcon size={24} color="#0da6f2" />
                // </Marker>

                <MotoTaxiMarker coordinate={{
                  longitude: rider.location.longitude,
                  latitude: rider.location.latitude,
                }} />
              )}

              {coords && (
                <Polyline
                  coordinates={coords}
                  strokeColor="#0da6f2"
                  strokeWidth={6}
                />
              )}
            </MapView>
          )}
        </Box>
        {/* ===== MAPVIEW ===== */}

        {delivery.status === "pending" && (
          <PayDeliveryRequestSheet deliveryRequest={delivery} />
        )}

        {delivery.status === "awaitingPayment" && <WaitingForPaymentSheet />}
        {delivery.status === "assigningRider" && <AssignRiderSheet />}
        {delivery.status === "inTransit" &&
          activeData.rider &&
          activeData.riderProfile && (
            <WaitingRiderSheet
              deliveryRequest={delivery}
              riderProfile={activeData.riderProfile}
            />
          )}
        {delivery.status === "delivering" &&
          activeData.rider &&
          activeData.riderProfile && (
            <DeliveryProgressSheet
              deliveryRequest={delivery}
              riderProfile={activeData.riderProfile}
            />
          )}
        {delivery.status === "handoff" &&
          activeData.rider &&
          activeData.riderProfile &&
          activeData.imageUrl && (
            <HandoffSheet
              deliveryRequest={delivery}
              riderProfile={activeData.riderProfile}
              imageUrl={activeData.imageUrl}
            />
          )}
      </Box>
    </GestureHandlerRootView>
  );
}
