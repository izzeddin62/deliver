import React, { forwardRef, useCallback } from "react";

import LocationCard from "@/components/LocationCard";
import { Box } from "@/components/ui/box";
import {
  ButtonSpinner,
  ButtonText,
  Button as GButton,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { api } from "@/convex/_generated/api";
import { formatDistance } from "@/utils/distance";
import { useConvexMutation } from "@convex-dev/react-query";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation } from "@tanstack/react-query";
import {
  Clock,
  DollarSign,
  Flag,
  LocationEdit,
  Ruler,
} from "lucide-react-native";

interface ConfirmDeliveryRequestSheetProps {
  duration: string | null;
  distance: number | null;
  price: number | null;
  onClose?: () => void;

  pickup: string | null;
  destination: string | null;
  pickupAddress: {
    latitude: number;
    longitude: number;
  } | null;
  destinationAddress: {
    latitude: number;
    longitude: number;
  } | null;
}

const ConfirmDeliveryRequestSheet = forwardRef<
  BottomSheet,
  ConfirmDeliveryRequestSheetProps
>(
  (
    {
      duration,
      distance,
      price,
      pickup,
      destination,
      pickupAddress,

      destinationAddress,
      onClose,
    },
    ref
  ) => {
    const { mutateAsync, isPending } = useMutation({
      mutationFn: useConvexMutation(
        api.lib.mutations.deliveryRequests.createDeliveryRequest
      ),
    });

    const createNewDelivery = async () => {
      await mutateAsync({
        pickup: {
          name: pickup ?? "Current Location",
          latitude: pickupAddress?.latitude ?? 0,
          longitude: pickupAddress?.longitude ?? 0,
        },
        destination: {
          name: destination ?? "Destination",
          latitude: destinationAddress?.latitude ?? 0,
          longitude: destinationAddress?.longitude ?? 0,
        },
      });
      // router.replace("/(app)/user/active");
    };

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
      console.log("handleSheetChanges", index);
    }, []);
    return (
      <BottomSheet
        ref={ref}
        onChange={handleSheetChanges}
        index={1}
        snapPoints={["10%", "90%"]}
        style={{
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 16,
          zIndex: 99999,
        }}
      >
        <BottomSheetView className="px-3 py-4 gap-6">
          <Box>
            <Heading className="text-base mb-3">Location</Heading>
            <Box className="gap-3 -ml-0.5">
              <LocationCard
                title={"From"}
                location={pickup}
                icon={<LocationEdit size={20} color={"#666666"} />}
              />
              <LocationCard
                title={"To"}
                location={destination}
                icon={<Flag size={20} color={"#666666"} />}
              />
            </Box>
          </Box>

          <Box>
            <Heading className="text-base mb-3">Journey</Heading>
            <Box className="gap-2">
              <Box className="bg-secondary-100 flex-row justify-between items-center p-3 rounded-lg">
                <Box className="flex-row items-center gap-3">
                  <Box className="p-2 bg-white rounded-full">
                    <Ruler size={20} color={"#666666"} />
                  </Box>
                  <Text className="text-base font-semibold">Distance</Text>
                </Box>
                <Text className="text-base font-semibold">
                  {distance ? formatDistance(distance) : 0}
                </Text>
              </Box>
              <Box className="bg-secondary-100 flex-row justify-between items-center p-3 rounded-lg">
                <Box className="flex-row items-center gap-3">
                  <Box className="p-2 bg-white rounded-full">
                    <Clock size={20} color={"#666666"} />
                  </Box>
                  <Text className="text-base font-semibold">Time</Text>
                </Box>
                <Text className="text-base font-semibold">{duration}</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading className="text-base mb-3">Payment info</Heading>
            <Box className="bg-secondary-100 flex-row justify-between items-center p-3 rounded-lg">
              <Box className="flex-row items-center gap-3">
                <Box className="p-2 bg-white rounded-full">
                  <DollarSign size={20} color={"#666666"} />
                </Box>
                <Text className="text-base font-semibold">Delivery Price</Text>
              </Box>
              <Text className="text-base font-semibold">{price}RWF</Text>
            </Box>
          </Box>

          <Box className="flex-row gap-2">
            <GButton
              size="xl"
              onPress={() => {
                if (onClose) {
                  onClose();
                }
              }}
              className="flex-1"
              variant="solid"
              action="secondary"
            >
              <ButtonText>Cancel</ButtonText>
            </GButton>
            <GButton size="xl" className="flex-1" onPress={createNewDelivery}>
              {isPending && <ButtonSpinner />}
              <ButtonText className="ml-2">{isPending ? "Confirming" : "Confirm"}</ButtonText>
            </GButton>
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

ConfirmDeliveryRequestSheet.displayName = "ConfirmDeliveryRequestSheet";

export default ConfirmDeliveryRequestSheet;
