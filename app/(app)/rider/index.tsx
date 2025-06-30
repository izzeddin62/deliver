import dayjs from "dayjs";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import Spinner from "@/components/Spinner";
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
import polyline from "@mapbox/polyline";
import { useMutation, useQuery } from "convex/react";
import duration from "dayjs/plugin/duration";
import { CameraView } from "expo-camera";
import * as Location from "expo-location";
import { Redirect, useRouter } from "expo-router";
import {
  BadgePercent,
  HouseIcon,
  LocationEdit,
  Phone,
} from "lucide-react-native";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";
import { Button, H6, Paragraph } from "tamagui";

dayjs.extend(duration);

export default function UserMapScreen() {
  const router = useRouter();
  // ——— STATE HOOKS ———
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentMarker, setCurrentMarker] = useState<LatLng | null>(null);
  // const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const acceptAssigment = useMutation(
    api.lib.mutations.deliveryAssignments.acceptRiderAssignment
  );
  const declineAssigment = useMutation(
    api.lib.mutations.deliveryAssignments.rejectRiderAssignment
  );
  const startDelivery = useMutation(api.lib.mutations.user.startDelivery);
  const deliveryInfo = useQuery(
    api.lib.queries.riderAssignment.riderAssignment
  );
  const { data } = useComputeRoutes(
    currentMarker,
    deliveryInfo?.deliveryRequest?.destination
      ? deliveryInfo?.deliveryRequest?.destination
      : null,
    deliveryInfo?.deliveryRequest?.pickup
      ? [deliveryInfo?.deliveryRequest?.pickup]
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

  const coords = data?.routes?.[0]
    ? polyline
        .decode(data.routes[0].polyline.encodedPolyline)
        .map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
    : null;

  async function handoverPackage() {
    router.replace("/(app)/rider/handoff");
  }

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

  return (
    <Fragment>
      <Box>
        <CameraView ref={ref} mode="picture"></CameraView>
      </Box>
      <Box className="flex-1">
        {initialRegion && (
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
                    longitude: deliveryInfo.deliveryRequest.pickup.longitude,
                  }}
                  title="Destination"
                />
              )}

            {deliveryInfo.deliveryRequest?.destination &&
              deliveryInfo.deliveryRequest.status !== "done" && (
                <Marker
                  coordinate={{
                    latitude: deliveryInfo.deliveryRequest.destination.latitude,
                    longitude:
                      deliveryInfo.deliveryRequest.destination.longitude,
                  }}
                  title="Destination"
                />
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

        {/* ===== MAPVIEW ===== */}

        {deliveryRequest && riderAssignment && (
          <Drawer
            isOpen={deliveryInfo.deliveryRequest?.status !== "done"}
            onClose={() => {}}
            anchor="bottom"
            size="md"
          >
            <DrawerContent className="bg-background-50 rounded-t-2xl">
              <DrawerHeader>
                <H6 color={"$accent7"}>New Delivery</H6>
              </DrawerHeader>
              <DrawerBody>
                {riderAssignment.response === "pending" && (
                  <Fragment>
                    <Box className="flex-row gap-3">
                      <Box className="flex-1">
                        <Box className="flex-row gap-2 items-center mt-2">
                          <Box className="bg-[#E8EDF5] w-14 h-14 mb-2 rounded-md items-center justify-center">
                            <LocationEdit size={24} color={"#737373"} />
                          </Box>
                          <Box>
                            <Paragraph
                              marginBlock={0}
                              fontWeight={500}
                              marginBlockEnd={-4}
                            >
                              Pickup point
                            </Paragraph>
                            <Paragraph marginBlock={0} color={"$accent9"}>
                              {deliveryRequest.pickup.name}
                            </Paragraph>
                          </Box>
                        </Box>

                        <Box className="flex-row gap-2 items-center mt-2">
                          <Box className="bg-[#E8EDF5] w-14 h-14 mb-2 rounded-md items-center justify-center border border-background-100">
                            <LocationEdit size={24} color={"#737373"} />
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
                              {deliveryRequest.destination.name}
                            </Paragraph>
                          </Box>
                        </Box>
                      </Box>
                      <Box className="flex-1 h-fit">
                        <Box className=" rounded-md flex-1 shadow-slate-600  border border-primary-0 border-opacity-10 p-4 h-fit">
                          <BadgePercent color="#808080" />
                          <Paragraph
                            fontWeight={700}
                            color={"$accent10"}
                            marginBlockStart={8}
                          >
                            Price
                          </Paragraph>
                          <Paragraph
                            fontWeight={700}
                            marginBlockStart={-4}
                            size="$7"
                            color={"green"}
                          >
                            {deliveryRequest.price} RWF
                          </Paragraph>
                        </Box>
                      </Box>
                    </Box>
                  </Fragment>
                )}

                {riderAssignment.response === "accepted" &&
                  deliveryRequest.status === "inTransit" && (
                    <Fragment>
                      <Box className="flex-row gap-3">
                        <Box className="flex-1">
                          <Box className="flex-row gap-2 items-center mt-2">
                            <Box className="bg-[#E8EDF5] w-14 h-14 mb-2 rounded-md items-center justify-center">
                              <LocationEdit size={24} color={"#737373"} />
                            </Box>
                            <Box>
                              <Paragraph
                                marginBlock={0}
                                fontWeight={500}
                                marginBlockEnd={-4}
                              >
                                Pickup point
                              </Paragraph>
                              <Paragraph marginBlock={0} color={"$accent9"}>
                                10 KG 245 ST
                              </Paragraph>
                            </Box>
                          </Box>

                          <Box className="flex-row gap-2 items-center mt-2">
                            <Box className="bg-[#E8EDF5] w-14 h-14 mb-2 rounded-md items-center justify-center border border-background-100">
                              <LocationEdit size={24} color={"#737373"} />
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
                                Kimironko market
                              </Paragraph>
                            </Box>
                          </Box>
                        </Box>
                        <Box className="flex-1 h-fit">
                          <Box className=" rounded-md flex-1 shadow-slate-600  border border-primary-0 border-opacity-10 p-4 h-fit">
                            <Phone color="#808080" />
                            <Paragraph
                              fontWeight={700}
                              color={"$accent10"}
                              marginBlockStart={8}
                            >
                              Phone number
                            </Paragraph>
                            <Paragraph
                              fontWeight={700}
                              marginBlockStart={-4}
                              size="$6"
                              color={"green"}
                            >
                              +250784949494
                            </Paragraph>
                          </Box>
                        </Box>
                      </Box>
                    </Fragment>
                  )}
                {riderAssignment.response === "accepted" &&
                  deliveryRequest.status === "delivering" && (
                    <Box>
                      <Box className="flex-row gap-2 items-center mt-2">
                        <Box className="bg-[#E8EDF5] w-14 h-14 mb-2 rounded-md items-center justify-center">
                          <Phone size={24} color={"#737373"} />
                        </Box>
                        <Box>
                          <Paragraph
                            marginBlock={0}
                            fontWeight={500}
                            marginBlockEnd={-4}
                          >
                            Contact person
                          </Paragraph>
                          <Paragraph
                            marginBlock={0}
                            // color={"$accent9"}
                            color={"green"}
                          >
                            +250785059493
                          </Paragraph>
                        </Box>
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
                            Kimironko Market
                          </Paragraph>
                        </Box>
                      </Box>
                    </Box>
                  )}

                {riderAssignment.response === "accepted" &&
                  deliveryRequest.status === "handoff" && (
                    <Box className="rounded-2xl  w-full gap-2 text-center items-center">
                      <Spinner />
                      <H6 className="text-2xl font-bold text-gray-800 mb-3">
                        Waiting for Final Check
                      </H6>
                      <Paragraph
                        className="text-base text-gray-600"
                        text={"center"}
                      >
                        Please hold on while the user completes their final
                        check before confirming your ride.
                      </Paragraph>
                    </Box>
                  )}
              </DrawerBody>

              <DrawerFooter>
                {riderAssignment.response === "pending" && (
                  <Box className="flex-row gap-3">
                    <Button
                      theme={"red"}
                      flex={1}
                      onPress={() => {
                        return declineAssigment({
                          assignmentId: riderAssignment._id,
                        });
                      }}
                    >
                      Decline
                    </Button>
                    <Button
                      flex={1}
                      theme={"green"}
                      onPress={() => {
                        return acceptAssigment({
                          assignmentId: riderAssignment._id,
                        });
                      }}
                    >
                      Accept
                    </Button>
                  </Box>
                )}
                {riderAssignment.response === "accepted" &&
                  deliveryRequest.status === "inTransit" && (
                    <Button
                      theme={"black"}
                      onPress={() => {
                        startDelivery({
                          deliveryId: deliveryRequest?._id,
                        });
                      }}
                    >
                      Start delivery
                    </Button>
                  )}
                {riderAssignment.response === "accepted" &&
                  deliveryRequest.status === "delivering" && (
                    <Button theme={"black"} onPress={handoverPackage}>
                      Package handoff
                    </Button>
                  )}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </Box>
    </Fragment>
  );
}
