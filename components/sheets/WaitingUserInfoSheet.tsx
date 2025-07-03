import React, { forwardRef, useCallback } from "react";

import LocationCard from "@/components/LocationCard";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDuration } from "@/services/duration.services";
import { formatDistance } from "@/utils/distance";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
import { Clock, Flag, LocationEdit, Ruler, User } from "lucide-react-native";
import { Linking } from "react-native";

interface WaitingUserInfoSheetProps {
  onClose?: () => void;
  deliveryRequest: Doc<"deliveryRequests">;
  requester: Doc<"users">;
}

const WaitingUserInfoSheet = forwardRef<BottomSheet, WaitingUserInfoSheetProps>(
  ({ deliveryRequest, requester }, ref) => {
    const startDelivery = useMutation(api.lib.mutations.user.startDelivery);

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
        <BottomSheetScrollView className="px-3 py-4 gap-6">
          <Box className="gap-4">
            <Box className="gap-3 pb-10">
              <Heading>Delivery Owner</Heading>
              <Box className="flex-row items-center gap-3">
                <Box className="bg-secondary-200 rounded-full w-14 h-14 justify-center items-center">
                  <User size={28} strokeWidth={1} />
                </Box>
                <Box>
                  <Text className="font-medium text-primary-900">
                    {requester.email}
                  </Text>
                  <Text className="text-sm text-typography-500">
                    {deliveryRequest.phoneNumber}
                  </Text>
                </Box>
              </Box>
              <Button
                size="lg"
                className="flex-1"
                onPress={() =>
                  Linking.openURL(`tel:${deliveryRequest.phoneNumber}`)
                }
              >
                <ButtonText>Call </ButtonText>
              </Button>
            </Box>

            <Box className="mb-4">
              <Heading className="text-xl mb-3 pl-2">Location</Heading>
              <Box className="gap-6">
                <LocationCard
                  title={"From"}
                  location={deliveryRequest.pickup.name}
                  large
                  icon={
                    <LocationEdit size={28} color={"#666666"} strokeWidth={1} />
                  }
                />
                <LocationCard
                  title={"To"}
                  large
                  location={deliveryRequest.destination.name}
                  icon={<Flag size={28} color={"#666666"} strokeWidth={1} />}
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
                    {deliveryRequest.distanceMeters
                      ? formatDistance(deliveryRequest.distanceMeters)
                      : 0}
                  </Text>
                </Box>
                <Box className="bg-secondary-100 flex-row justify-between items-center p-3 rounded-lg">
                  <Box className="flex-row items-center gap-3">
                    <Box className="p-2 bg-white rounded-full">
                      <Clock size={20} color={"#666666"} />
                    </Box>
                    <Text className="text-base font-semibold">Time</Text>
                  </Box>
                  <Text className="text-base font-semibold">
                    {deliveryRequest.duration
                      ? formatDuration(parseInt(deliveryRequest.duration))
                      : 0}
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box className="mt-5">
              <Button
                size="xl"
                onPress={() => {
                  startDelivery({
                    deliveryId: deliveryRequest?._id,
                  });
                }}
              >
                <ButtonText>Start delivery</ButtonText>
              </Button>
            </Box>
          </Box>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

WaitingUserInfoSheet.displayName = "WaitingUserInfoSheet";

export default WaitingUserInfoSheet;
