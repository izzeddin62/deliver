import React, { forwardRef, useCallback } from "react";

import LocationCard from "@/components/LocationCard";
import { Box } from "@/components/ui/box";
import {
    ButtonText,
    Button as GButton
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDuration } from "@/services/duration.services";
import { formatDistance } from "@/utils/distance";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
    Clock,
    DollarSign,
    Flag,
    LocationEdit,
    Ruler,
} from "lucide-react-native";
import PhoneModal from "../modals/PhoneModal";

interface PayDeliveryRequestSheetProps {

  onClose?: () => void;
  deliveryRequest: Doc<"deliveryRequests">;


}

const PayDeliveryRequestSheet = forwardRef<
  BottomSheet,
  PayDeliveryRequestSheetProps
>(
  (
    {
      deliveryRequest,
      onClose,
    },
    ref
  ) => {



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
                  {deliveryRequest.distanceMeters ? formatDistance(deliveryRequest.distanceMeters) : 0}
                </Text>
              </Box>
              <Box className="bg-secondary-100 flex-row justify-between items-center p-3 rounded-lg">
                <Box className="flex-row items-center gap-3">
                  <Box className="p-2 bg-white rounded-full">
                    <Clock size={20} color={"#666666"} />
                  </Box>
                  <Text className="text-base font-semibold">Time</Text>
                </Box>
                <Text className="text-base font-semibold">{deliveryRequest.duration ? formatDuration(parseInt(deliveryRequest.duration)): 0}</Text>
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
              <Text className="text-base font-semibold">{deliveryRequest.price}RWF</Text>
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
 
            <PhoneModal deliveryId={deliveryRequest._id} />
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

PayDeliveryRequestSheet.displayName = "PayDeliveryRequestSheet";

export default PayDeliveryRequestSheet;
