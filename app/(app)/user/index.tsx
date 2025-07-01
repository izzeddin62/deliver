import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

import { SearchLocation } from "@/components/SearchLocation";
import { Box } from "@/components/ui/box";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useComputeRoutes } from "@/hooks/useComputedRoute";
import { formatDuration } from "@/services/duration.services";
import { AddressData } from "@/types";
import polyline from "@mapbox/polyline";
import { useAction, useMutation, useQuery } from "convex/react";
import duration from "dayjs/plugin/duration";
import * as Location from "expo-location";
import { Redirect, useRouter } from "expo-router";
import { BadgePercent, Bike, Contact, UserRound } from "lucide-react-native";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";
import { Button, Paragraph } from "tamagui";

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
export default function UserMapScreen() {
  const router = useRouter();
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

  const createDelivery = useMutation(
    api.lib.mutations.deliveryRequests.createDeliveryRequest
  );
  const createLocationRequest = useMutation(
    api.lib.mutations.friends.createFriendLocationRequest
  );
  const acceptLocationRequest = useMutation(
    api.lib.mutations.friends.acceptFriendLocationRequest
  );
  const rejectLocationRequest = useMutation(
    api.lib.mutations.friends.rejectFriendLocationRequest
  );
  const delivery = activeData?.deliveryRequest;

  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentMarker, setCurrentMarker] = useState<LatLng | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const [destination, setDestination] = useState<AddressData | null>(null);
  const destinationCoordinates = destination
    ? {
        longitude: destination.geometry.location.lng,
        latitude: destination.geometry.location.lat,
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
      const data = await getStreetName({
        lat: latitude,
        lng: longitude,
      });
      setCurrentAddress(data);

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

  if (
    friendsData === null ||
    activeData === null ||
    friendLocationRequest === null ||
    sentFriendLocationRequest === null
  ) {
    return <Redirect href="/login" />;
  }
  if (delivery) {
    return <Redirect href="/(app)/user/active" />;
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
  const coords = data?.routes?.[0]
    ? polyline
        .decode(data.routes[0].polyline.encodedPolyline)
        .map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
    : null;

  const duration = data?.routes?.[0].duration.slice(
    0,
    data?.routes?.[0].duration.length - 1
  );
  const formattedDuration = duration
    ? formatDuration(parseInt(duration))
    : null;

  const friends = friendsData.friends;
  const locationRequest = friendLocationRequest.request;
  const sentLocationRequest = sentFriendLocationRequest.request;
  const friendWhoSentRequest = friendLocationRequest.friend;

  return (
    <Fragment>
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
          <Pressable onPress={() => setFriendDrawerOpen(!friendDrawerOpen)} className="p-3 rounded-full shadow-md bg-background-800">
            <Contact size={24} color={"white"} />
          </Pressable>
        </Box>
        {locationRequest && locationRequest.status === "pending" && (
          <Box className="bg-background-100 absolute top-0 shadow-lg h-fit right-2 left-2 rounded-lg z-20 py-4 px-5">
            <Paragraph fontWeight={500}>
              {friendWhoSentRequest?.email} has sent a location request
            </Paragraph>
            <Box className="flex-row gap-2 items-center mt-2">
              <Paragraph marginBlockStart={-6}>
                Please accept the request to share your location
              </Paragraph>
            </Box>
            <Box className="flex-row gap-2 items-center mt-4 justify-end">
              <Button
                onPress={async () => {
                  await rejectLocationRequest({
                    requestId: locationRequest?._id,
                  });
                  setDestination(null);
                }}
              >
                Cancel
              </Button>
              <Button
                theme={"black"}
                className="ml-1"
                marginInlineStart={8}
                onPress={async () => {
                  await acceptLocationRequest({
                    requestId: locationRequest?._id,
                  });
                }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
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

              {coords && destination && !sentLocationRequest && (
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

        <Drawer
          isOpen={!!data || !!sentLocationRequest}
          onClose={() => {
            setDestination(null);
            setKey(1);
          }}
          anchor="bottom"
          size={data && !sentLocationRequest ? "md" : "sm"}
        >
          <DrawerContent className="bg-background-50 rounded-t-2xl">
            <DrawerHeader>
              {destination && !sentLocationRequest && (
                <Paragraph fontWeight={600} size={"$8"} color={"$accent7"}>
                  {destination?.formatted_address}
                </Paragraph>
              )}
            </DrawerHeader>

            <DrawerBody>
              {data && !sentLocationRequest && (
                <Box className="flex flex-row gap-3">
                  <Box className=" rounded-md flex-1 shadow-slate-600  border border-primary-0 border-opacity-10 p-4">
                    <Bike color="#808080" />
                    <Paragraph
                      fontWeight={700}
                      color={"$accent10"}
                      marginBlockStart={8}
                    >
                      Duration
                    </Paragraph>
                    <Paragraph fontWeight={700} marginBlockStart={-4} size="$7">
                      {formattedDuration}
                    </Paragraph>
                  </Box>
                  <Box className=" rounded-md flex-1 shadow-slate-600  border border-primary-0 border-opacity-10 p-4">
                    <BadgePercent color="#808080" />
                    <Paragraph
                      fontWeight={700}
                      color={"$accent10"}
                      marginBlockStart={8}
                    >
                      Cost
                    </Paragraph>
                    <Paragraph
                      fontWeight={700}
                      marginBlockStart={-4}
                      size="$7"
                      color={"green"}
                    >
                      1500
                    </Paragraph>
                  </Box>
                </Box>
              )}

              {sentLocationRequest &&
                sentLocationRequest.status === "pending" && (
                  <Box>
                    <Paragraph fontWeight={500}>
                      Waiting for friend to confirm location request
                    </Paragraph>
                    <Box className="flex-row gap-2 items-center mt-2 w-full">
                      <Box className="bg-[#E8EDF5] w-12 h-12 mb-2 rounded-md items-center justify-center">
                        <UPLoading />
                      </Box>

                      <Box className="-mt-2">
                        <Paragraph>
                          Please hold on, we&apos;re waiting for your friend
                        </Paragraph>
                        <Paragraph>to confirm their location.</Paragraph>
                      </Box>
                    </Box>
                    <Paragraph color={"#075a83"} size={"$2"}>
                      We will notify you once your friend confirms their
                      location.
                    </Paragraph>
                  </Box>
                )}
            </DrawerBody>

            <DrawerFooter>
              {data && !sentLocationRequest && (
                <Fragment>
                  <Button
                    onPress={() => {
                      // setDestination(null);
                      setKey(1);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    theme={"black"}
                    className="ml-1"
                    marginInlineStart={8}
                    onPress={async () => {
                      await createDelivery({
                        pickup: {
                          name: currentAddress ?? "Current Location",
                          latitude: currentMarker?.latitude ?? 0,
                          longitude: currentMarker?.longitude ?? 0,
                        },
                        destination: {
                          name: destination?.formatted_address ?? "Destination",
                          latitude: destination?.geometry.location.lat ?? 0,
                          longitude: destination?.geometry.location.lng ?? 0,
                        },
                      });
                      router.replace("/(app)/user/active");
                    }}
                  >
                    Confirm
                  </Button>
                </Fragment>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer
          isOpen={friendDrawerOpen}
          onClose={() => setFriendDrawerOpen(false)}
          anchor="bottom"
          size="lg"
        >
          <DrawerContent className="bg-background-50 rounded-t-2xl">
            <DrawerHeader>
              <Paragraph fontWeight={600} size={"$8"} color={"$accent7"}>
                Send package to a friend
              </Paragraph>
            </DrawerHeader>

            <DrawerBody>
              {/* Here you can list friends or any other content */}
              <Box className="gap-6 mt-6">
                {friends.length === 0 && (
                  <Box className="flex-1 items-center justify-center">
                    <Paragraph size={"$6"}>You have no friends yet</Paragraph>
                  </Box>
                )}
                {friends.map((friend) => (
                  <Pressable
                    key={friend._id}
                    className="flex-row items-center gap-2"
                    onPress={async () => {
                      await createLocationRequest({ friendId: friend._id });
                      setFriendDrawerOpen(false);
                    }}
                  >
                    <Box className="p-4 bg-[#f1f2f4]">
                      <UserRound size={28} />
                    </Box>
                    <Box>
                      <Paragraph size={"$6"}>{friend.email}</Paragraph>
                      <Paragraph color={"$accent10"}>
                        Added on{" "}
                        {new Date(friend._creationTime).toLocaleDateString()}
                      </Paragraph>
                    </Box>
                  </Pressable>
                ))}
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button
                onPress={() => setFriendDrawerOpen(false)}
                theme={"black"}
              >
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </Fragment>
  );
}
