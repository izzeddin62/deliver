import React from "react";

import Copter from "@/components/icons/Copter";
import Destination from "@/components/icons/Destination";
import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Paragraph } from "tamagui";

export default function Delivery() {
  return (
    <Box className="flex-1 px-4 bg-white">
      <Box className="w-full mt-8">
        <Paragraph size={"$7"} fontWeight={600}>
          Route
        </Paragraph>
        <Box className="w-full h-fit rounded-xl border-[#DCE0E5] border mt-3">
          <Box className="p-4 flex-row gap-10">
            <Box className="flex pt-3 pl-2 text-[#1873dc]">
              <Copter />
            </Box>
            <Box>
              <Text className="text-[#637488] text-sm  uppercase tracking-wide">
                Pickup
              </Text>
              <Text className="text-primary-500 leading-normal">
                Amahoro Stadium
              </Text>
              <Text className="text-[#637488] text-sm">34 KG 45 AV</Text>
            </Box>
          </Box>
          <Box className="p-4 flex-row gap-10 border-t border-[#DCE0E5]">
            <Box className="flex pt-3 pl-2 text-[#1873dc] ">
              <Destination />
            </Box>
            <Box>
              <Text className="text-[#637488] text-sm  uppercase tracking-wide">
                Destination
              </Text>
              <Text className="text-primary-500 leading-normal">
                Kimironko market
              </Text>
              <Text className="text-[#637488] text-sm">KG 456 ST</Text>
            </Box>
          </Box>
        </Box>

        <Paragraph size={"$7"} fontWeight={600} marginBlockStart={20}>
          Delivery Summary
        </Paragraph>

        <Box className="w-full h-fit rounded-xl border-[#DCE0E5] border mt-3">
          <Box className="p-4 flex-row w-full justify-between">
            <Text className="text-[#637488] text-sm  uppercase tracking-wide">
              Price
            </Text>
            <Text className="text-primary-500 leading-normal">1500RWF</Text>
          </Box>
          <Box className="p-4 flex-row w-full justify-between">
            <Text className="text-[#637488] text-sm uppercase tracking-wide">
              Status
            </Text>
            <Box className="bg-green-100 px-3 py-0.5 rounded-full ">
              <Text className="text-green-600 text-sm leading-normal">
                Completed
              </Text>
            </Box>
          </Box>
        </Box>

        <Paragraph size={"$7"} fontWeight={600} marginBlockStart={20}>
          Owner Information
        </Paragraph>

        <Box className="w-full h-fit rounded-xl border-[#DCE0E5] border mt-3 flex-row items-center p-4 gap-4">
          <Image
            source={require("@/assets/images/user.jpg")}

            className="rounded-full w-16 h-16"
          />
          <Box className="">
            <Text className="text-primary-500 text-xl leading-normal">John Doe</Text>
            <Text className=" text-[#637488] text-sm  uppercase tracking-wide">
              +250785940394
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
