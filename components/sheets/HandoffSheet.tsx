import React, { forwardRef, useCallback } from "react";

import { Box } from "@/components/ui/box";
import { Doc } from "@/convex/_generated/dataModel";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Image } from "../ui/image";
import { Text } from "../ui/text";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

interface HandoffSheetProps {
  onClose?: () => void;
  deliveryRequest: Doc<"deliveryRequests">;
  riderProfile: Doc<"profiles">;
  imageUrl: string;
}

const HandoffSheet = forwardRef<BottomSheet, HandoffSheetProps>(
  ({ deliveryRequest, riderProfile, onClose, imageUrl }, ref) => {
    const completeDelivery = useMutation(
      api.lib.mutations.deliveryRequests.completeDelivery
    );
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
      console.log("handleSheetChanges", index);
    }, []);
    return (
      <BottomSheet
        ref={ref}
        onChange={handleSheetChanges}
        style={{
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 16,
          zIndex: 99999,
        }}
      >
        <BottomSheetScrollView className="px-3 py-4">
          <Box className="w-full">
            <Image
              source={imageUrl}
              className="w-full h-[250px] rounded-xl"
              resizeMode="cover"
            />

            <Box className="mt-5">
              <Heading className="font-heading text-typography-900">
                Package handover
              </Heading>
              <Text className="mt-1 font-body text-typography-600">
                The rider has handed over the package.
              </Text>
              <Text>Please confirm</Text>
            </Box>
          </Box>

          <Box className="mt-5 pb-10">
            <Button
              size="xl"
              onPress={() => {
                return completeDelivery({
                  deliveryId: deliveryRequest._id,
                });
              }}
            >
              <ButtonText>Complete Delivery</ButtonText>
            </Button>
          </Box>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

HandoffSheet.displayName = "HandoffSheet";

export default HandoffSheet;
