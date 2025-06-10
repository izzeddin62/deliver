import { Box } from "@/components/ui/box";
// import { Button, ButtonText } from "@/components/ui/button";
// import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { useRouter } from "expo-router";
import { Button } from 'tamagui';

export default function Index() {
  const router = useRouter();
  return (
    <Box className="h-full">
      <VStack space="md" className="h-full">
        <Image
          source={require("@/assets/images/splash-icon.png")}
          className="w-full h-fit"
          alt="deliver"
        />

        <VStack className="px-4 flex-1 justify-end pb-4" space="sm">
          {/* <Button className="w-full" onPress={() => router.navigate("/signup")}>
            <ButtonText>Get started</ButtonText>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onPress={() => router.navigate("/login")}
          >
            <ButtonText>Continue</ButtonText>
          </Button> */}
          <Button theme="black" onPress={() => router.navigate("/signup")}>Get started</Button>

          <Button  onPress={() => router.navigate("/login")}>Continue</Button>
        </VStack>
      </VStack>
    </Box>
  );
}
