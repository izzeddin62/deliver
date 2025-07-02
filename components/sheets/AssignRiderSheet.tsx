import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

import { Box } from "@/components/ui/box";
import { Search } from "lucide-react-native";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

const AssignRiderSheet = forwardRef<BottomSheet>((_, ref) => {
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
          <Box className="justify-center items-center mb-5 mt-3">
            <Box className="bg-info-50 p-4 rounded-full items-center justify-center">
              <Search size={28} strokeWidth={1} />
            </Box>
          </Box>

          <Heading className="text-center font-semibold text-base">
            Searching for a rider...
          </Heading>
          <Text className="text-[#075a83] text-sm text-center">
            We will let you know when your rider is ready
          </Text>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
});

AssignRiderSheet.displayName = "AssignRiderSheet";
export default AssignRiderSheet;
