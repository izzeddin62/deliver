import React, { forwardRef, useCallback } from "react";

import LocationCard from "@/components/LocationCard";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Doc } from "@/convex/_generated/dataModel";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Flag, LocationEdit } from "lucide-react-native";
import { Linking } from "react-native";

interface RiderHandoffSheetProps {
  onClose?: () => void;
  deliveryRequest: Doc<"deliveryRequests">;
}

const RiderHandoffSheet = forwardRef<BottomSheet, RiderHandoffSheetProps>(
  ({ deliveryRequest }, ref) => {
    const router = useRouter();

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
      console.log("handleSheetChanges", index);
    }, []);
    return (
      <BottomSheet
        ref={ref}
        onChange={handleSheetChanges}
        index={1}
        snapPoints={["10%"]}
        style={{
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 16,
          zIndex: 99999,
        }}
      >
        <BottomSheetView className="px-3 py-4 gap-6">
          <Box className="gap-4">
            <Box className="gap-3 pb-3">
              <Button
                size="lg"
                className="flex-1"
                action="secondary"
                onPress={() =>
                  Linking.openURL(`tel:${deliveryRequest.contactNumber}`)
                }
              >
                <ButtonText>Call contact person</ButtonText>
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


            <Box className="mt-5">
              <Button
                size="xl"
                onPress={() => router.navigate("/(app)/rider/handoff")}
              >
                <ButtonText>Package handoff</ButtonText>
              </Button>
            </Box>
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

RiderHandoffSheet.displayName = "RiderHandoffSheet";

export default RiderHandoffSheet;
