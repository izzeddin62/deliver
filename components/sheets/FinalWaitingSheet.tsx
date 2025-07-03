import React, { forwardRef } from "react";

import { Box } from "@/components/ui/box";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Spinner from "../Spinner";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

const FinalWaitingSheet = forwardRef<BottomSheet>((_, ref) => {
  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={["10%", "90%"]}
      style={{
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: 16,
        zIndex: 99999,
      }}
    >
      <BottomSheetView className="px-3 py-4 gap-6">
        <Box className="rounded-2xl  w-full gap-2 text-center items-center">
          <Spinner />
          <Heading className="text-2xl font-semibold mt-3 text-gray-800 mb-1">
            Waiting for Final Check
          </Heading>
          <Text className=" text-typography-600 text-center">
            Please hold on while the user completes their final check before
            confirming your ride.
          </Text>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
});

FinalWaitingSheet.displayName = "FinalWaitingSheet";

export default FinalWaitingSheet;
