import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
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
        <Pressable
          className="w-12 h-12 rounded-full bg-background-100 items-center justify-center mt-4"
          onPress={() => router.back()}
        >
          <MoveLeft size={20} color={"black"} />
        </Pressable>

        <Box className="my-8">
          <Heading size="2xl">Sign up to Deliver</Heading>
          <Text>Sign up and get access to our delivery network</Text>
        </Box>
        <Box className="gap-4">
          <Box>
            <Text className="mb-1">First name</Text>
            <Input size="lg">
              <InputField>e.g: John</InputField>
            </Input>
          </Box>
          <Box>
            <Text className="mb-1">last name</Text>
            <Input size="lg">
              <InputField>e.g: Ishimwe</InputField>
            </Input>
          </Box>
          <Box>
            <Text className="mb-1">Phone number</Text>
            <Input size="lg">
              <InputField>Your Number</InputField>
            </Input>
            <Text>A confirmation message will be sent on your phone</Text>
          </Box>
          <Box>
            <Text className="mb-1">Password</Text>
            <Input size="lg">
              <InputField>Your Password</InputField>
            </Input>
          </Box>
        </Box>

        <Button className="my-4" onPress={() => router.navigate("/user")}>
          <ButtonText>Signup</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
