import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { Plus, UserRound } from "lucide-react-native";
import { SafeAreaView } from "react-native";
import { Button, Paragraph } from "tamagui";

export default function Friends() {
  const router = useRouter();
  const data = useQuery(api.lib.queries.friends.friends);
  if (data === null) {
    return <Redirect href="/login" />;
  }
  if (!data) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }
  const friends = data.friends;
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1 bg-background-100 relative">
        <Box className="w-full px-3 bg-background-0 py-6">
          <Heading size="xl">My Friends</Heading>
        </Box>
        <Box className="gap-6 mt-3 flex-1 bg-white pt-4 px-3">
          {friends.length === 0 && (
            <Box className="flex-1 items-center justify-center">
              <Paragraph size={"$6"}>You have no friends yet</Paragraph>
            </Box>
          )}
          {friends.map((friend) => (
            <Box key={friend._id} className="flex-row items-center gap-2">
              <Box className="p-3 bg-[#f1f2f4] rounded-full">
                <UserRound size={24} strokeWidth={1} />
              </Box>
              <Box>
                <Text className="font-semibold">{friend.email}</Text>
                <Text className="text-typography-500">
                  Added on {new Date(friend._creationTime).toLocaleDateString()}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
        <Box className="absolute bottom-4 right-4 z-10">
          <Button
            icon={<Plus color={"white"} />}
            circular
            size={"$6"}
            theme={"black"}
            onPress={() => {
              router.navigate("/user/scanner");
            }}
          ></Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
