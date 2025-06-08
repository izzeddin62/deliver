import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Link, LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import { Pressable, ScrollView } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <ScrollView className="bg-background-light px-4">
      <VStack>
        {/* <Button variant="link">
        <ButtonText>Back</ButtonText>
          <ButtonIcon> */}
        <Pressable
          className="w-12 h-12 rounded-full bg-background-100 items-center justify-center mt-4"
          onPress={() => router.back()}
        >
          <MoveLeft size={20} color={"black"} />
        </Pressable>

        <Heading size="2xl" className="my-8">
          Log in to Deliver
        </Heading>
        <Box className="gap-4">
          <Box>
            <Text className="mb-1">Phone number</Text>
            <Input size="lg">
              <InputField>Your Number</InputField>
            </Input>
          </Box>
          <Box>
            <Text className="mb-1">Password</Text>
            <Input size="lg">
              <InputField>Your Password</InputField>
            </Input>
          </Box>
        </Box>
        <Link onPress={() => router.navigate("/")} className="my-6">
          <LinkText>Forgot password</LinkText>
        </Link>

        <Button onPress={() => router.navigate("/user")}>
          <ButtonText>Login</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
