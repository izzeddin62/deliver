import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

import { SearchLocation } from "@/components/SearchLocation";
import ConfirmDeliveryRequestSheet from "@/components/sheets/ConfirmDeliveryRequestSheet";
import { Box } from "@/components/ui/box";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useComputeRoutes } from "@/hooks/useComputedRoute";
import { formatDuration } from "@/services/duration.services";
import { AddressData } from "@/types";
import { calculateDeliveryCost } from "@/utils/cost";
import BottomSheet from "@gorhom/bottom-sheet";
import polyline from "@mapbox/polyline";
import { useAction, useQuery } from "convex/react";
import duration from "dayjs/plugin/duration";
import * as Location from "expo-location";
import { Redirect } from "expo-router";
import { Contact } from "lucide-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";
import LocationRequestModal from "../modals/LocationRequestModal";
import FriendListSheet from "../sheets/FriendListSheet";
import WaitingLocationRequestSheet from "../sheets/WaitingLocationRequestSheet";
import { Text } from "../ui/text";

const KIGALI_BOUNDS = {
  north: -1.85, // top
  south: -2.1, // bottom
  east: 30.2, // right
  west: 30.0, // left
};

const isInsideKigali = (lat: number, lng: number) => {
  return (
    lat >= KIGALI_BOUNDS.south &&
    lat <= KIGALI_BOUNDS.north &&
    lng >= KIGALI_BOUNDS.west &&
    lng <= KIGALI_BOUNDS.east
  );
};
dayjs.extend(duration);
export default function UserMapIndexScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const friendSheetRef = useRef<BottomSheet>(null);
  const waitingForLocationRef = useRef(null);
  // ——— STATE HOOKS ———
  const [region, setRegion] = useState<Region | null>(null);
  const [friendDrawerOpen, setFriendDrawerOpen] = useState(false);
  const friendsData = useQuery(api.lib.queries.friends.friends);
  const [key, setKey] = useState(0);
  const friendLocationRequest = useQuery(
    api.lib.queries.friends.friendLocationRequest
  );
  const sentFriendLocationRequest = useQuery(
    api.lib.queries.friends.sentFriendLocationRequest
  );
  const getStreetName = useAction(
    api.lib.actions.map.getCurrentLocationDetails
  );

  const activeData = useQuery(
    api.lib.queries.deliveryRequests.ActiveDeliveryRequest
  );
  const delivery = activeData?.deliveryRequest;

  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentMarker, setCurrentMarker] = useState<LatLng | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const [destination, setDestination] = useState<AddressData | null>(null);
  const destinationCoordinates = destination
    ? {
        longitude: destination?.geometry.location.lng,
        latitude: destination?.geometry.location.lat,
      }
    : null;

  const { data, isLoading } = useComputeRoutes(
    currentMarker,
    destinationCoordinates,
    null
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
      const locationData = await getStreetName({
        lat: latitude,
        lng: longitude,
      });
      setCurrentAddress(locationData);

      // Define an initial region centered on user's location
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setCurrentMarker({ latitude, longitude });
    })();
  }, [getStreetName]);

  useEffect(() => {
    if (data && !isLoading) {
      // open the bottom sheet when routes are computed
      sheetRef.current?.expand();
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (friendDrawerOpen) {
      // Close the bottom sheet when the friend drawer is open
      sheetRef.current?.close();
    }
  }, [friendDrawerOpen]);

  useEffect(() => {
    if (friendDrawerOpen) {
      friendSheetRef.current?.expand();
    } else {
      friendSheetRef.current?.close();
    }
  }, [friendDrawerOpen]);

  if (
    friendsData === null ||
    activeData === null ||
    friendLocationRequest === null ||
    sentFriendLocationRequest === null
  ) {
    return <Redirect href="/login" />;
  }
  if (delivery) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text>delivery not found</Text>
      </Box>
    );
  }
  if (
    !friendsData ||
    !activeData ||
    !friendLocationRequest ||
    !sentFriendLocationRequest
  ) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }
  const coords =
    data?.routes?.[0] && destination
      ? polyline
          .decode(data?.routes?.[0].polyline.encodedPolyline)
          .map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
      : null;
  const duration = destination
    ? data?.routes?.[0].duration.slice(0, data?.routes?.[0].duration.length - 1)
    : null;
  const formattedDuration = duration
    ? formatDuration(parseInt(duration))
    : null;

  const friends = friendsData.friends;
  const locationRequest = friendLocationRequest.request;
  const sentLocationRequest = sentFriendLocationRequest.request;
  const friendWhoSentRequest = friendLocationRequest.friend;
  const onPressDismiss = () => {
    sheetRef.current?.close(); // or snapToIndex(1) to minimize
    setKey(1);
  };

  const isValidCoords =
    Array.isArray(coords) &&
    coords.length > 0 &&
    coords.every(
      (point) =>
        point &&
        typeof point.latitude === "number" &&
        typeof point.longitude === "number"
    );

  return (
    <GestureHandlerRootView>
      <Box className="flex-1">
        {/* ===== SEARCH BAR AT THE TOP ===== */}
        <Box className="absolute top-2 h-20 left-0 right-0 z-10  items-center gap-2 px-3 pb-4 flex-row ">
          <Box className="flex-1">
            <SearchLocation
              isLoading={isLoading}
              onValueChange={(va) => {
                setDestination(va);
                setKey(0);
              }}
              isOutLine
              key={key}
            />
          </Box>
          <Pressable
            onPress={() => setFriendDrawerOpen(!friendDrawerOpen)}
            className="p-3 rounded-full shadow-md bg-background-800"
          >
            <Contact size={24} color={"white"} />
          </Pressable>
        </Box>

        {locationRequest &&
          friendWhoSentRequest &&
          locationRequest.status === "pending" && (
            <LocationRequestModal
              friendWhoSentRequest={friendWhoSentRequest}
              locationRequest={locationRequest}
            />
          )}

        {/* ===== MAPVIEW ===== START */}

        <Box className="flex-1 h-40">
          {initialRegion && (
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={initialRegion}
              showsUserLocation={true}
              loadingEnabled
              region={region ?? initialRegion}
              onRegionChangeComplete={(newRegion) => {
                if (isInsideKigali(newRegion.latitude, newRegion.longitude)) {
                  setRegion(newRegion);
                } else {
                  Alert.alert(
                    "Outside Kigali",
                    "Please stay within the Kigali area."
                  );
                  setRegion(initialRegion); // Reset to center
                }
              }}
            >
              {destinationCoordinates && !sentLocationRequest && (
                <Marker
                  coordinate={destinationCoordinates}
                  title="Destination"
                />
              )}

              {isValidCoords && (
                <Polyline
                  coordinates={coords}
                  strokeColor="#0da6f2"
                  strokeWidth={6}
                />
              )}
            </MapView>
          )}
        </Box>
        {/* ===== MAPVIEW ===== END*/}

        {destination && data && !sentLocationRequest && (
          <ConfirmDeliveryRequestSheet
            ref={sheetRef}
            onClose={onPressDismiss}
            duration={formattedDuration}
            pickup={currentAddress ?? null}
            destination={destination?.formatted_address ?? null}
            distance={data?.routes?.[0].distanceMeters ?? null}
            destinationAddress={{
              latitude: destination?.geometry.location.lat,
              longitude: destination?.geometry.location.lng,
            }}
            pickupAddress={currentMarker}
            price={
              data?.routes?.[0].distanceMeters
                ? calculateDeliveryCost(data?.routes?.[0].distanceMeters)
                : null
            }
          />
        )}
        {friendDrawerOpen && (
          <FriendListSheet
            ref={friendSheetRef}
            friends={friends}
            onClose={() => {
              setFriendDrawerOpen(false);
            }}
          />
        )}

        {sentLocationRequest && sentLocationRequest.status === "pending" && (
          <WaitingLocationRequestSheet ref={waitingForLocationRef} />
        )}

        {/* ===== FRIEND DRAWER ===== */}
      </Box>
    </GestureHandlerRootView>
  );
}
