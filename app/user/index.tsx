import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { SearchLocation } from "@/components/SearchLocation";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Text } from "@/components/ui/text";
import { AddressData } from "@/types";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import MapView, { LatLng, Region } from "react-native-maps";

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

export default function UserMapScreen() {
  // ——— STATE HOOKS ———
  const router = useRouter();
  const [region, setRegion] = useState<Region | null>(null);
  const [key, setKey] = useState(0);
  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean>(false);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [currentMarker, setCurrentMarker] = useState<LatLng | null>(null);

  const [test, setTest] = useState<AddressData | null>(null);

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

  return (
    <Box className="flex-1">
      {/* ===== SEARCH BAR AT THE TOP ===== */}
      <Box className="absolute top-0 h-20 left-0 right-0 z-10 bg-primary-500 justify-end px-3 pb-3">
        <SearchLocation
          onValueChange={(va) => {
            setTest(va);
            setKey(0);
          }}
          isOutLine
          key={key}
        />
      </Box>

      <Box className="flex-1">
        {initialRegion && (
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={initialRegion}
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
                setRegion(initialRegion); // Reset to center
              }
            }}
          ></MapView>
        )}
      </Box>

      {/* ===== MAPVIEW ===== */}

      <Drawer
        isOpen={!!test}
        onClose={() => {
          setTest(null);
          setKey(1);
        }}
        anchor="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <Text>Selected Destination</Text>
          </DrawerHeader>
          <DrawerBody>
            <Text className="text-primary-200" size="sm">
              Destination:
            </Text>
            <Box className="bg-primary-50 w-full h-[1px] mt-3 mb-1"></Box>
            <Text className="text-primary-500" size="sm">
              {test?.formatted_address}
            </Text>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              onPress={() => {
                setTest(null);
                setKey(1);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              className="ml-1"
              onPress={() => {
                router.navigate("/user/delivery");
                setTest(null);
              }}
            >
              <ButtonText>Confirm & Pay</ButtonText>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
