import React, { forwardRef, useCallback } from "react";

import LocationCard from "@/components/LocationCard";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDuration } from "@/services/duration.services";
import { formatDistance } from "@/utils/distance";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { motorRacingHelmet } from "@lucide/lab";
import {
  Clock,
  Flag,
  Icon,
  LocationEdit,
  Ruler
} from "lucide-react-native";
import { Linking } from "react-native";

interface WaitingRiderSheetProps {
  onClose?: () => void;
  deliveryRequest: Doc<"deliveryRequests">;
  riderProfile: Doc<"profiles">;
}

const WaitingRiderSheet = forwardRef<BottomSheet, WaitingRiderSheetProps>(
  ({ deliveryRequest, riderProfile, onClose }, ref) => {
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
              <Heading>{riderProfile.firstName} will arrive shortly</Heading>
              <Box className="flex-row items-center gap-3">
                <Box className="bg-secondary-200 rounded-full w-14 h-14 justify-center items-center">
                  <Icon
                    iconNode={motorRacingHelmet}
                    size={28}
                    strokeWidth={1}
                  />
                </Box>
                <Box>
                  <Text className="font-medium text-primary-900">
                    {riderProfile.firstName} {riderProfile.lastName}
                  </Text>
                  <Text className="text-sm text-typography-500">RAC40T</Text>
                </Box>
              </Box>
              <Button size="lg" className="flex-1" onPress={() => Linking.openURL(`tel:0784088507`)}>
                <ButtonText>Call {riderProfile.firstName}</ButtonText>
              </Button>
            </Box>

            <Box>
              <Heading className="text-base mb-3">Location</Heading>
              <Box className="gap-3 -ml-0.5">
                <LocationCard
                  title={"From"}
                  location={deliveryRequest.pickup.name}
                  icon={<LocationEdit size={20} color={"#666666"} />}
                />
                <LocationCard
                  title={"To"}
                  location={deliveryRequest.destination.name}
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

          </Box>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

WaitingRiderSheet.displayName = "WaitingRiderSheet";

export default WaitingRiderSheet;
