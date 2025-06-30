import { Box } from "@/components/ui/box";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { Plus, UserRound } from "lucide-react-native";
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
    <Box className="flex-1 bg-white p-4 relative">
      <Box className="gap-6 mt-6">
        {friends.length === 0 && (
          <Box className="flex-1 items-center justify-center">
            <Paragraph size={"$6"}>You have no friends yet</Paragraph>
          </Box>
        )}
        {friends.map((friend) => (
          <Box key={friend._id} className="flex-row items-center gap-2">
            <Box className="p-4 bg-[#f1f2f4]">
              <UserRound size={28} />
            </Box>
            <Box>
              <Paragraph size={"$6"}>{friend.email}</Paragraph>
              <Paragraph color={"$accent10"}>
                Added on {new Date(friend._creationTime).toLocaleDateString()}
              </Paragraph>
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
  );
}
