import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

import { Box } from "@/components/ui/box";
import { Bell } from "lucide-react-native";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

const WaitingForPaymentSheet = forwardRef<BottomSheet>((_, ref) => {
  return (
    <BottomSheet
      ref={ref}
      style={{
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: 16,
        zIndex: 99999,
      }}
    >
      <BottomSheetView className="px-4 pb-10 gap-6">
        <Box>
          <Box className="w-full flex-row justify-center mb-8 mt-3">
            <Box className="bg-info-50 p-4 rounded-full">
              <Bell size={28} className="mb-2" strokeWidth={1} />
            </Box>
          </Box>
          <Box className="text-center w-full ">
            <Heading className="text-center text-base">
              A payment request of 1500RWF has been sent to your mobile money
              number
            </Heading>
            <Text className="text-center text-primary-200 mt-2">Please check your mobile money and confirm the payment</Text>
          </Box>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
});

WaitingForPaymentSheet.displayName = "WaitingForPaymentSheet";
export default WaitingForPaymentSheet;
