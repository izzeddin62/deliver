import { Box } from "@/components/ui/box";
import { Link, LinkText } from "@/components/ui/link";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import { Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Input, Label } from "tamagui";

export default function Rider() {
  const router = useRouter();
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

          <H4 className="my-8" marginBlockStart={32} marginBlockEnd={16}>
            Log in to Deliver
          </H4>
          <Box className="gap-2">
            <Box>
              <Label htmlFor="number" marginBlockEnd={-6}>Phone number</Label>
              <Input placeholder="Your Number" id="number" />
            </Box>
            <Box>
              <Label htmlFor="password" marginBlockEnd={-6}>Password</Label>
              <Input placeholder="Your Password"></Input>
            </Box>
          </Box>
          <Link onPress={() => router.navigate("/")} className="my-6">
            <LinkText>Forgot password</LinkText>
          </Link>

          <Button theme="black" onPress={() => router.navigate("/rider")}>Login</Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
