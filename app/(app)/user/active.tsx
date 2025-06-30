import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

import PhoneModal from "@/components/modals/PhoneModal";
import { Box } from "@/components/ui/box";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Image } from "@/components/ui/image";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useComputeRoutes } from "@/hooks/useComputedRoute";
import { formatDuration } from "@/services/duration.services";
import polyline from "@mapbox/polyline";
import { useMutation, useQuery } from "convex/react";
import duration from "dayjs/plugin/duration";
import * as Location from "expo-location";
import { Redirect } from "expo-router";
import {
  BadgePercent,
  Bike,
  BikeIcon,
  HouseIcon,
  Phone,
  Search,
} from "lucide-react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { Button, H5, H6, Paragraph, Progress } from "tamagui";

dayjs.extend(duration);
export default function ActiveDelivery() {
  const activeData = useQuery(
    api.lib.queries.deliveryRequests.ActiveDeliveryRequest
  );
  const completeDelivery = useMutation(
    api.lib.mutations.deliveryRequests.completeDelivery
  );
  const delivery = activeData?.deliveryRequest;

  const rider = activeData?.rider;

  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  const [state, setState] = useState("default");

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

  const formattedDuration = delivery?.duration
    ? formatDuration(parseInt(delivery?.duration))
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
  console.log(activeData.imageUrl, "-===== data");
  return (
    <Fragment>
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
                <Marker
                  coordinate={{
                    longitude: rider.location.longitude,
                    latitude: rider.location.latitude,
                  }}
                  title="Rider Location"
                  pinColor="#0da6f2"
                >
                  <BikeIcon size={24} color="#0da6f2" />
                </Marker>
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

        <Drawer
          isOpen={!!data}
          anchor="bottom"
          size={delivery.status === "handoff" ? "lg" : "md"}
        >
          {/* <DrawerBackdrop /> */}
          <DrawerContent className="bg-background-50 rounded-t-2xl">
            {state !== "delivering" && (
              <DrawerHeader>
                <Paragraph fontWeight={600} size={"$8"} color={"$accent7"}>
                  {delivery.destination?.name}
                </Paragraph>
              </DrawerHeader>
            )}
            <DrawerBody>
              {delivery.status === "pending" && (
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
                      {delivery.price}rwf
                    </Paragraph>
                  </Box>
                </Box>
              )}

              {delivery.status === "awaitingPayment" && (
                <Box>
                  <Box className="text-center w-full ">
                    <H5 fontWeight={500}>{delivery.price}rwf</H5>
                    <Paragraph>
                      A payment request has been sent to your mobile money.
                    </Paragraph>
                  </Box>
                  <Box className="mt-2">
                    <Paragraph marginBlockEnd={-5} size={"$3"}>
                      To: +250788164780
                    </Paragraph>
                    <Paragraph color={"slategrey"}>Mobile money</Paragraph>
                  </Box>
                </Box>
              )}
              {delivery.status === "assigningRider" && (
                <Box className="mt-5">
                  <Paragraph fontWeight={500}>
                    Searching for a rider...
                  </Paragraph>
                  <Box className="flex-row gap-2 items-center mt-2">
                    <Pressable onPress={() => setState("ready")}>
                      <Box className="bg-[#E8EDF5] w-12 h-12 mb-2 rounded-md items-center justify-center">
                        <Search size={20} />
                      </Box>
                    </Pressable>

                    <Paragraph marginBlockStart={-6}>
                      Please hold on, we&apos;re finding you a rider
                    </Paragraph>
                  </Box>
                  <Paragraph color={"#075a83"} size={"$2"}>
                    We will let you know when your rider is ready
                  </Paragraph>
                </Box>
              )}
              {delivery.status === "inTransit" && (
                <Box className="">
                  <H6 fontWeight={500}>Rider en route</H6>
                  <Paragraph marginBlock={8} size={"$5"}>
                    Your rider is on the way. Estimated arrival time: 3 min
                  </Paragraph>
                  <Box className="flex-row gap-2 items-center mt-2">
                    <Pressable onPress={() => setState("delivering")}>
                      <Box className="bg-[#E8EDF5] w-12 h-12 mb-2 rounded-md items-center justify-center">
                        <Phone size={20} />
                      </Box>
                    </Pressable>

                    <Paragraph marginBlockStart={-6}>+250788164788</Paragraph>
                  </Box>
                </Box>
              )}

              {delivery.status === "delivering" && (
                <Box>
                  <Box className="flex-row gap-2 items-center mt-2">
                    <Box className="bg-[#E8EDF5] w-14 h-14 mb-2 rounded-md items-center justify-center">
                      <BikeIcon size={24} color={"#737373"} />
                    </Box>
                    <Box>
                      <Paragraph
                        marginBlock={0}
                        fontWeight={500}
                        marginBlockEnd={-4}
                      >
                        Delivery on the way
                      </Paragraph>
                      <Paragraph marginBlock={0} color={"$accent9"}>
                        Arriving in {formattedDuration}
                      </Paragraph>
                    </Box>
                  </Box>

                  <Box className="my-4">
                    <Paragraph fontWeight={500} marginBlockEnd={4}>
                      Delivery
                    </Paragraph>
                    <Progress value={70}>
                      <Progress.Indicator animation="bouncy" />
                    </Progress>
                  </Box>

                  <Box className="flex-row gap-2 items-center mt-2">
                    <Box className="bg-[#E8EDF5] w-14 h-14 mb-2 rounded-md items-center justify-center border border-background-100">
                      <HouseIcon size={24} color={"#737373"} />
                    </Box>
                    <Box className="justify-center -mt-2">
                      <Paragraph
                        marginBlock={0}
                        fontWeight={500}
                        marginBlockEnd={-4}
                      >
                        Delivery Address
                      </Paragraph>
                      <Paragraph marginBlock={0} color={"$accent9"}>
                        {delivery.destination?.name}
                      </Paragraph>
                    </Box>
                  </Box>
                </Box>
              )}
              {delivery.status === "handoff" && (
                <Box className="w-full">
                  {activeData.imageUrl && (
                    <Image
                      source={activeData.imageUrl}
                      className="w-full h-[250px] rounded-xl"
                      resizeMode="cover"
                    />
                  )}
                  <Box className="mt-5">
                    <H6 text={"center"} fontWeight={500}>
                      Package handover
                    </H6>
                    <Paragraph text={"center"}>
                      The rider has handed over the package.
                    </Paragraph>
                    <Paragraph text={"center"}>Please confirm</Paragraph>
                  </Box>
                </Box>
              )}
            </DrawerBody>

            <DrawerFooter>
              {delivery.status === "pending" && (
                <Fragment>
                  <Button onPress={() => {}}>Cancel</Button>
                  <PhoneModal deliveryId={delivery._id} />
                </Fragment>
              )}

              {delivery.status === "awaitingPayment" && (
                <Button width={"100%"} onPress={() => setState("searching")}>
                  Paying...
                </Button>
              )}
              {delivery.status === "handoff" && (
                <Box className="w-full">
                  <Button
                    theme={"black"}
                    width={"auto"}
                    onPress={() => {
                      return completeDelivery({
                        deliveryId: delivery._id,
                      });
                    }}
                  >
                    Complete Delivery
                  </Button>
                </Box>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </Fragment>
  );
}
