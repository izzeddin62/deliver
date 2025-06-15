import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";

import { useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import { Pressable, SafeAreaView, ScrollView } from "react-native";
import { Button, H4, Input, Label, Text } from "tamagui";

export default function Profile() {
  const router = useRouter();

  const data = useQuery(api.lib.queries.users.currentUser);

  if (data == null) {
    return <Redirect href={"/login"} />;
  }
  if (data && data.user && data.user.type === undefined) {
    return <Redirect href={"/category"} />;
  }

  if (data && data.user && data.user.type === "user") {
    return <Redirect href={"/user"} />;
  }

  if (data && data.user && data.user.type === "rider" && data.profile) {
    return <Redirect href={"/rider"} />;
  }

  if (data === undefined) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView className="bg-background-light px-4">
        <VStack>
          <Pressable
            className="w-12 h-12 rounded-full bg-background-100 items-center justify-center mt-4"
            onPress={() => router.back()}
          >
            <MoveLeft size={20} color={"black"} />
          </Pressable>
          <Box className="mt-8 mb-5">
            <H4>Sign up to Deliver</H4>
            <Text color={"$accent1"}>
              Sign up and get access to our delivery network
            </Text>
          </Box>

          <Box className="gap-2">
            <Box>
              <Label marginBlockEnd={-6}>First name</Label>
              <Input placeholder="e.g: John"></Input>
            </Box>
            <Box>
              <Label marginBlockEnd={-6}>last name</Label>
              <Input placeholder="e.g: Ishimwe"></Input>
            </Box>
            <Box>
              <Label marginBlockEnd={-6}>Bike licence number</Label>
              <Input placeholder="e.g: RAC 456"></Input>
            </Box>
            <Box>
              <Label marginBlockEnd={-6}>Drive licence</Label>
              <Input placeholder="e.g: 1198080043026249"></Input>
            </Box>
            <Box>
              <Label marginBlockEnd={-6}>Phone number</Label>
              <Input placeholder="Your Number"></Input>
              <Text color={"$accent10"} marginBlockStart={2}>
                A confirmation message will be sent on your phone
              </Text>
            </Box>
            <Box>
              <Label marginBlockEnd={-6}>Password</Label>
              <Input placeholder="Your Password"></Input>
            </Box>
          </Box>

          <Button
            className="my-4"
            marginBlock={16}
            onPress={() => router.navigate("/rider")}
            theme="black"
          >
            Signup
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
