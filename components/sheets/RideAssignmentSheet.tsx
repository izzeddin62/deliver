import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

import { Box } from "@/components/ui/box";
import {
    Clock,
    DollarSign,
    Flag,
    LocationEdit,
    Ruler,
} from "lucide-react-native";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDuration } from "@/services/duration.services";
import { formatDistance } from "@/utils/distance";
import { useMutation } from "convex/react";
import LocationCard from "../LocationCard";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

interface RideAssignmentSheetProps {
  deliveryRequest: Doc<"deliveryRequests">;
  assignment: Doc<"riderAssignments">;
}

const RideAssignmentSheet = forwardRef<BottomSheet, RideAssignmentSheetProps>(
  ({ deliveryRequest, assignment }, ref) => {
    const acceptAssigment = useMutation(
      api.lib.mutations.deliveryAssignments.acceptRiderAssignment
    );
    const declineAssigment = useMutation(
      api.lib.mutations.deliveryAssignments.rejectRiderAssignment
    );
    return (
      <BottomSheet
        ref={ref}
        style={{
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 16,
          zIndex: 99999,
        }}
      >
        <BottomSheetView className="px-4 pb-5 gap-6">
          <Box className="gap-6 pt-4">
            <Box>
              <Heading className="text-base mb-4">Location</Heading>
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

            <Box>
              <Heading className="text-base mb-3">Payment info</Heading>
              <Box className="bg-secondary-100 flex-row justify-between items-center p-3 rounded-lg">
                <Box className="flex-row items-center gap-3">
                  <Box className="p-2 bg-white rounded-full">
                    <DollarSign size={20} color={"#666666"} />
                  </Box>
                  <Text className="text-base font-semibold">
                    Delivery Price
                  </Text>
                </Box>
                <Text className="text-base font-semibold">
                  {deliveryRequest.price}RWF
                </Text>
              </Box>
            </Box>

            <Box className="flex-row gap-2 mt-4 justify-normal">
              <Button
                size="xl"
                onPress={() => {
                  return declineAssigment({
                    assignmentId: assignment._id,
                  });
                }}
                className="flex-1"
                variant="solid"
                action="negative"
              >
                <ButtonText>Reject</ButtonText>
              </Button>
              <Button
                size="xl"
                onPress={() => {
                  return acceptAssigment({
                    assignmentId: assignment._id,
                  });
                }}
                className="flex-1"
                variant="solid"
                action="positive"
              >
                <ButtonText>Accept</ButtonText>
              </Button>
            </Box>
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

RideAssignmentSheet.displayName = "RideAssignmentSheet";
export default RideAssignmentSheet;
