import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ChevronRight, Wallet2 } from "lucide-react-native";
import { Paragraph } from "tamagui";

export default function Balance() {
  return (
    <Box className="flex-1 bg-white px-4">
      <Box className="w-full">
        <Text className="text-sm text-[#6B7280] uppercase tracking-wider mb-1 mt-16 text-center">
          Available Balance
        </Text>
        <Text className="text-4xl font-bold text-typography-black tracking-tight text-center">
          60,000RWF
        </Text>
      </Box>
      <Box>
        <Paragraph size={"$6"} fontWeight={500} marginBlockStart={32}>
          Recent Withdrawals
        </Paragraph>
        <Box className="w-full h-fit rounded-xl border-[#DCE0E5] border mt-3">
          <Box className="p-4 flex-row w-full justify-between">
            <Text className="text-[#637488] ">May 15, 2025</Text>
            <Text className="text-primary-500 leading-normal">15,000RWF</Text>
          </Box>
          <Box className="p-4 flex-row w-full justify-between border-t border-[#DCE0E5]">
            <Text className="text-[#637488] ">May 12, 2025</Text>
            <Text className="text-primary-500 leading-normal">25,000RWF</Text>
          </Box>
          <Box className="p-4 flex-row w-full justify-between border-t border-[#DCE0E5]">
            <Text className="text-[#637488] ">May 11, 2025</Text>
            <Text className="text-primary-500 leading-normal">10,000RWF</Text>
          </Box>
        </Box>

        <Box className="w-full h-fit rounded-xl border-[#DCE0E5] border mt-16 p-4 flex-row gap-4">
          <Box className="p-4 bg-teal-400 rounded-full w-14 h-14 justify-center items-center">
            <Wallet2 />
          </Box>
          <Box className="flex-row items-center justify-between flex-1">
            <Box>
              <Text size="lg" className="text-typography-black">
                Withdraw Funds
              </Text>
              <Text className="text-[#637488] ">Send money instantly</Text>
            </Box>
            <ChevronRight />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
