import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";

import { Box } from "@/components/ui/box";
import { UPLoading } from "../UPLoader";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

const WaitingLocationRequestSheet = forwardRef<BottomSheet>((_, ref) => {
  return (
    <BottomSheet
      ref={ref}
      style={{
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: 16,
        zIndex: 99999,
      }}
    >
      <BottomSheetView className="px-3 pt-3 pb-10 gap-6">
        <Box>
          <Heading className="text-base font-semibold">
            Waiting location request confirmation
          </Heading>
          <Box className="flex-row gap-2 items-center mt-2 w-full">
            <Box className="bg-[#E8EDF5] w-12 h-12 mb-2 rounded-md items-center justify-center">
              <UPLoading />
            </Box>

            <Box className="-mt-2">
              <Text>Please hold on, we&apos;re waiting for your friend</Text>
              <Text>to confirm their location.</Text>
            </Box>
          </Box>
          <Text className="text-[#075a83] text-sm">
            We will notify you once your friend confirms their location.
          </Text>
        </Box>
        <Box>
          <Button action="secondary" size="lg">
            <ButtonText>Cancel</ButtonText>
          </Button>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
});

// {
//   sentLocationRequest && sentLocationRequest.status === "pending" && (
//     <Box>
//       <Paragraph fontWeight={500}>
//         Waiting for friend to confirm location request
//       </Paragraph>
//       <Box className="flex-row gap-2 items-center mt-2 w-full">
//         <Box className="bg-[#E8EDF5] w-12 h-12 mb-2 rounded-md items-center justify-center">
//           <UPLoading />
//         </Box>

//         <Box className="-mt-2">
//           <Paragraph>
//             Please hold on, we&apos;re waiting for your friend
//           </Paragraph>
//           <Paragraph>to confirm their location.</Paragraph>
//         </Box>
//       </Box>
//       <Paragraph color={"#075a83"} size={"$2"}>
//         We will notify you once your friend confirms their location.
//       </Paragraph>
//     </Box>
//   );
// }

WaitingLocationRequestSheet.displayName = "WaitingLocationRequestSheet";
export default WaitingLocationRequestSheet;
