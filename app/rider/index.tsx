import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";

import { Box } from "@/components/ui/box";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from "@/components/ui/drawer";
import { useComputeRoutes } from "@/hooks/useComputedRoute";
import polyline from "@mapbox/polyline";
import duration from "dayjs/plugin/duration";
import * as Location from "expo-location";
import {
    BadgePercent,
    HouseIcon,
    LocationEdit,
    Phone,
} from "lucide-react-native";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";
import { Button, H6, Paragraph } from "tamagui";

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

const destinationCood = {
  longitude: 30.1263200284355,
  latitude: -1.9496286,
};

const pickupCood = {
  latitude: -1.955,
  longitude: 30.1145,
};
export default function UserMapScreen() {
  // ——— STATE HOOKS ———
  const [region, setRegion] = useState<Region | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentMarker, setCurrentMarker] = useState<LatLng | null>(null);
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

  const { data } = useComputeRoutes(currentMarker, destinationCood, [
    pickupCood,
  ]);
  const coords = data?.routes?.[0]
    ? polyline
        .decode(data.routes[0].polyline.encodedPolyline)
        .map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
    : null;



  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1">
        <Box className="flex-1">
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
              {destinationCood && (
                <Marker coordinate={destinationCood} title="Destination" />
              )}

              {pickupCood && (
                <Marker coordinate={pickupCood} title="Destination" />
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

        <Drawer isOpen={true} onClose={() => {}} anchor="bottom" size="md">
          {/* <DrawerBackdrop /> */}
          <DrawerContent className="bg-background-50 rounded-t-2xl">
            <DrawerHeader>
              <H6 color={"$accent7"}>New Delivery</H6>
            </DrawerHeader>
            <DrawerBody>
              {state === "default" && (
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
                          1500
                        </Paragraph>
                      </Box>
                    </Box>
                  </Box>
                </Fragment>
              )}

              {state === "en-route" && (
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
              {state === "delivering" && (
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
            </DrawerBody>

            <DrawerFooter>
              {state === "default" && (
                <Box className="flex-row gap-3">
                  <Button theme={"red"} flex={1}>
                    Decline
                  </Button>
                  <Button
                    flex={1}
                    theme={"green"}
                    onPress={() => {
                      setState("en-route");
                    }}
                  >
                    Accept
                  </Button>
                </Box>
              )}
              {state === "en-route" && (
                <Button theme={"black"} onPress={() => setState("delivering")}>
                  Start delivery
                </Button>
              )}
              {state === "delivering" && (
                <Button theme={"black"} onPress={() => setState("delivering")}>
                  Package handoff
                </Button>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </SafeAreaView>
  );
}
