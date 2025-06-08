import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Text } from "@/components/ui/text";
import { useComputeRoutes } from "@/hooks/useComputedRoute";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import MapView, { Marker, Polyline, Region } from "react-native-maps";

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

const from = { latitude: -1.9468524400481901, longitude: 30.11585425997283 };

const location = { latitude: -1.9449625, longitude: 30.0915492 };
export default function UserMapScreen() {
  // ——— STATE HOOKS ———
  const [region, setRegion] = useState<Region | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const { data, isLoading, error } = useComputeRoutes(from, location);
  const [state, setState] = useState("default");

  console.log(data, "====== data delivery", isLoading);

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

  if (isLoading) return null;
  if (error) return <Text>Error: {error.message}</Text>;

  const coords = polyline
    .decode(data!.routes[0].polyline.encodedPolyline)
    .map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
  console.log(polyline, "===== polyline");

  return (
    <Box className="flex-1">
      <Box className="flex-1">
        {initialRegion && (
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: (from.latitude + location.latitude) / 2,
              longitude: (from.longitude + location.longitude) / 2,
              latitudeDelta: Math.abs(from.latitude - location.latitude) * 1.5,
              longitudeDelta:
                Math.abs(from.longitude - location.longitude) * 1.5,
            }}
            showsUserLocation={true}
            region={region ?? initialRegion}
            onRegionChangeComplete={(newRegion) => {
              if (isInsideKigali(newRegion.latitude, newRegion.longitude)) {
                setRegion(newRegion);
              } else {
                Alert.alert(
                  "Outside Kigali",
                  "Please stay within the Kigali area."
                );
                setRegion(initialRegion);
              }
            }}
          >
            <Marker coordinate={from} title="Origin" />
            <Marker coordinate={location} title="Destination" />

            <Polyline
              coordinates={coords}
              strokeColor="#0da6f2"
              strokeWidth={6}
            />
          </MapView>
        )}
      </Box>
      <Drawer isOpen={true} anchor="bottom" size="md">
        {state === "default" && (
          <DrawerContent>
            <DrawerBody>
              <Text className="text-primary-200" size="sm">
                Destination:
              </Text>
              <Box className="bg-primary-50 w-full h-[1px] mt-3 mb-1"></Box>
              <Text className="text-primary-500" size="sm">
                BK Arena
              </Text>

              <Box className="mt-2">
                <Text>Total Price:</Text>
                <Text className="text-primary-500 font-bold">1500</Text>
              </Box>
            </DrawerBody>
            <DrawerFooter className="">
              <Button variant="outline">
                <ButtonText>Cancel Delivery</ButtonText>
              </Button>
              <Button
                className="ml-1"
                onPress={() => setState('paying')}
              >
                <ButtonText>Pay Delivery</ButtonText>
              </Button>
            </DrawerFooter>
          </DrawerContent>
        )}
        {state === "paying" && (
          <DrawerContent>
            <DrawerBody>
              <Box className="mt-2 mb-1">
                <Text>Total Price:</Text>
                <Text className="text-primary-500 font-bold">1500</Text>
              </Box>
              <Text className="mt-2">
                Your payment has been initiated, please check your mobile money
                to complete payment
              </Text>
            </DrawerBody>
            <DrawerFooter className="">
              <Button
                className="ml-1"
              >
                <ButtonText onPress={() => setState("payed")}>Paying... </ButtonText>
              </Button>
            </DrawerFooter>
          </DrawerContent>
        )}
        {state === "payed" && (
          <DrawerContent>
            <DrawerBody>
              <Text className="mt-2">
                Your payment has been received. Your rider has been notified. Please wait for arrival
              </Text>
            </DrawerBody>
            {/* <DrawerFooter className="">
              <Button
                className="ml-1"
              >
                <ButtonText>Paying... </ButtonText>
              </Button>
            </DrawerFooter> */}
          </DrawerContent>
        )}
      </Drawer>
    </Box>
  );
}
