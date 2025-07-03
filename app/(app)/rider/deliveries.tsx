import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { Redirect, useRouter } from "expo-router";
import { Package } from "lucide-react-native";
import { Pressable, SafeAreaView, ScrollView } from "react-native";

export default function Deliveries() {
  const router = useRouter();
  const activeData = useQuery(
    api.lib.queries.deliveryRequests.riderActiveDeliveryRequest
  );
  const deliveriesData = useQuery(
    api.lib.queries.deliveryRequests.riderLatestDeliveryRequests
  );
  if (activeData === null || deliveriesData === null) {
    return <Redirect href={"/login"} />;
  }

  if (!activeData || !deliveriesData) {
    return (
      <Box className="flex-1 justify-center items-center">
        <UPLoading />
      </Box>
    );
  }

  const groupedDeliveryRequest = deliveriesData.groupRequests;

  const groupedDates = Object.keys(groupedDeliveryRequest);
  const deliveryRequest = activeData.deliveryRequest;

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView
        className="bg-background-100  flex-1"
        contentContainerClassName="flex-1"
      >
        <Box className="w-full px-5 bg-background-0 py-6">
          <Heading size="xl">My Deliveries</Heading>
        </Box>

        <Box className="py-1"></Box>
        <Box className="px-5 bg-background-0 flex-1 pt-4">
          {deliveryRequest && (
            <Box className="gap-2">
              <Heading className="text-typography-500 text-sm font-medium">
                Active
              </Heading>
              <Pressable
                onPress={() => router.navigate("/(app)/user")}
                className="relative -left-1"
              >
                <Box className="flex-row items-center justify-between">
                  <Box className="flex-row items-center gap-4">
                    <Box className="bg-secondary-200 p-3 rounded-full">
                      <Package strokeWidth={1} />
                    </Box>
                    <Box>
                      <Heading className="text-sm font-medium">
                        {deliveryRequest.pickup.name}
                      </Heading>
                      <Text className="text-sm text-typography-600">
                        {deliveryRequest.destination.name}
                      </Text>
                    </Box>
                  </Box>

                  <Box className="flex-row gap-2 items-center">
                    <Text className="font-semibold">
                      {deliveryRequest.price}RWF
                    </Text>
                  </Box>
                </Box>
              </Pressable>
            </Box>
          )}

          <Box className="gap-6 mt-8">
            {groupedDates.map((date) => {
              const newDate = dayjs(date);
              const formatedDate = newDate.format("dddd, MMMM D, YYYY");
              const deliveries = groupedDeliveryRequest[date];
              return (
                <Box key={date}>
                  <Heading className="text-typography-500 text-sm font-medium mb-3">
                    {formatedDate}
                  </Heading>
                  <Box className="gap-5">
                    {deliveries.map((delivery) => {
                      return (
                        <Pressable
                          key={delivery._id}
                          onPress={() => router.navigate("/(app)/user")}
                          className="relative -left-1"
                        >
                          <Box className="flex-row items-center justify-between">
                            <Box className="flex-row items-center gap-4">
                              <Box className="bg-secondary-200 p-3 rounded-full">
                                <Package strokeWidth={1} />
                              </Box>
                              <Box className="gap-[2px]">
                                <Heading className="text-sm font-medium">
                                  {delivery.pickup.name}
                                </Heading>
                                <Text className="text-sm text-typography-600">
                                  {delivery.destination.name}
                                </Text>
                              </Box>
                            </Box>

                            <Box className="flex-row gap-2 items-center">
                              <Text className="font-semibold">
                                {delivery.price}RWF
                              </Text>
                            </Box>
                          </Box>
                        </Pressable>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>)
}
