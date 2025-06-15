import { Box } from "@/components/ui/box";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView } from "react-native";
import { H6, Paragraph, Progress } from "tamagui";

export default function Deliveries() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <ScrollView className="bg-white min-h-screen-safe h-full">
        <Box className="px-5 flex-1  mt-10">
          <Pressable onPress={() => router.navigate("/(app)/user")}>
            <Box className="flex-row items-center justify-between">
              <Box>
                <Paragraph size={"$5"} fontWeight={500}>
                  Delivery in Progress
                </Paragraph>
                <Paragraph>70% Complete</Paragraph>
              </Box>
              <Box className="flex-row gap-2 items-center">
                <Progress value={70} size={"$0.75"} width={80}>
                  <Progress.Indicator animation="bouncy" />
                </Progress>
                <Paragraph>70</Paragraph>
              </Box>
            </Box>
          </Pressable>

          <H6 fontWeight={500} marginBlock={20}>
            Recent
          </H6>

          <Box className="gap-4">
            <Pressable onPress={() => router.navigate("/(app)/user/delivery")}>
              <Box className="flex-row items-center justify-between">
                <Box>
                  <Paragraph size={"$5"} fontWeight={500}>
                    KG 245 St
                  </Paragraph>
                  <Paragraph>Pickup: Amohoro Stadium</Paragraph>
                </Box>
                <Box className="">
                  <Paragraph color={"$red10"}>Cancelled</Paragraph>
                </Box>
              </Box>
            </Pressable>

            <Box className="flex-row items-center justify-between">
              <Box>
                <Paragraph size={"$5"} fontWeight={500}>
                  Kimironko Market
                </Paragraph>
                <Paragraph>Pickup: Canalolympian</Paragraph>
              </Box>
              <Box className="">
                <Paragraph color={"$green10"}>Completed</Paragraph>
              </Box>
            </Box>

            <Box className="flex-row items-center justify-between">
              <Box>
                <Paragraph size={"$5"} fontWeight={500}>
                  Makuza Peace Plaza
                </Paragraph>
                <Paragraph>Pickup: 100 KG 456 ST</Paragraph>
              </Box>
              <Box className="">
                <Paragraph color={"$green10"}>Completed</Paragraph>
              </Box>
            </Box>

            <Box className="flex-row items-center justify-between">
              <Box>
                <Paragraph size={"$5"} fontWeight={500}>
                  Kimironko Market
                </Paragraph>
                <Paragraph>Pickup: Canalolympian</Paragraph>
              </Box>
              <Box className="">
                <Paragraph color={"$green10"}>Completed</Paragraph>
              </Box>
            </Box>

            <Box className="flex-row items-center justify-between">
              <Box>
                <Paragraph size={"$5"} fontWeight={500}>
                  Makuza Peace Plaza
                </Paragraph>
                <Paragraph>Pickup: 100 KG 456 ST</Paragraph>
              </Box>
              <Box className="">
                <Paragraph color={"$green10"}>Completed</Paragraph>
              </Box>
            </Box>

            <Box className="flex-row items-center justify-between">
              <Box>
                <Paragraph size={"$5"} fontWeight={500}>
                  KG 245 St
                </Paragraph>
                <Paragraph>Pickup: Amohoro Stadium</Paragraph>
              </Box>
              <Box className="">
                <Paragraph color={"$red10"}>Cancelled</Paragraph>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
