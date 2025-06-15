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
import { useComputeRoutes } from "@/hooks/useComputedRoute";
import { formatDuration } from "@/services/duration.services";
import { AddressData } from "@/types";
import polyline from "@mapbox/polyline";
import duration from "dayjs/plugin/duration";
import * as Location from "expo-location";
import {
  BadgePercent,
  Bike,
  BikeIcon,
  HouseIcon,
  Phone,
  Search,
} from "lucide-react-native";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";
import { Button, H5, H6, Paragraph, Progress } from "tamagui";

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
  // ——— STATE HOOKS ———
  const [region, setRegion] = useState<Region | null>(null);
  const [key, setKey] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean>(false);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentMarker, setCurrentMarker] = useState<LatLng | null>(null);

  const [test, setTest] = useState<AddressData | null>(null);
  const [state, setState] = useState("default");

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
      setHasLocationPermission(true);

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

  const destination = test
    ? {
        longitude: test.geometry.location.lng,
        latitude: test.geometry.location.lat,
      }
    : null;

  const { data, isLoading } = useComputeRoutes(
    currentMarker,
    destination,
    null
  );
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
  return (
    <Fragment>
      <Box className="flex-1">
        {/* ===== SEARCH BAR AT THE TOP ===== */}
        {!["searching", "delivering"].includes(state) && (
          <Box className="absolute top-0 h-20 left-0 right-0 z-10 bg-primary-500 justify-end px-3 pb-4">
            <SearchLocation
              isLoading={isLoading}
              onValueChange={(va) => {
                setTest(va);
                setKey(0);
              }}
              isOutLine
              key={key}
            />
          </Box>
        )}

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
              {destination && (
                <Marker coordinate={destination} title="Destination" />
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
          onClose={() => {
            setTest(null);
            setKey(1);
          }}
          anchor="bottom"
          size="md"
        >
          {/* <DrawerBackdrop /> */}
          <DrawerContent className="bg-background-50 rounded-t-2xl">
            {state !== "delivering" && (
              <DrawerHeader>
                <Paragraph fontWeight={600} size={"$8"} color={"$accent7"}>
                  {test?.formatted_address}
                </Paragraph>
              </DrawerHeader>
            )}
            <DrawerBody>
              {state === "default" && (
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

              {state === "paying" && (
                <Box>
                  <Box className="text-center w-full ">
                    <H5 fontWeight={500}>1500rwf</H5>
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
              {state === "searching" && (
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
              {state === "ready" && (
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

              {state === "delivering" && (
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
                    <Progress key={key} value={70}>
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
                        {test?.formatted_address}
                      </Paragraph>
                    </Box>
                  </Box>
                </Box>
              )}
            </DrawerBody>
            {state !== "ready" && (
              <DrawerFooter>
                {state === "default" && (
                  <Fragment>
                    <Button
                      onPress={() => {
                        setTest(null);
                        setKey(1);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      theme={"black"}
                      className="ml-1"
                      marginInlineStart={8}
                      onPress={() => {
                        setState("paying");
                      }}
                    >
                      Confirm & Pay
                    </Button>
                  </Fragment>
                )}

                {state === "paying" && (
                  <Button width={"100%"} onPress={() => setState("searching")}>
                    Paying...
                  </Button>
                )}
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      </Box>
    </Fragment>
  );
}
