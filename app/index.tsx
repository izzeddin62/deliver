import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const data = useQuery(api.lib.queries.users.currentUser);
  if (data && data.user && data.user.type === undefined) {
    return <Redirect href={"/category"} />;
  }

  if (data && data.user && data.user.type === "user") {
    return <Redirect href={"/user"} />;
  }

  if (data && data.user && data.user.type === "rider" && data.profile) {
    return <Redirect href={"/rider"} />;
  }

  if (data && data.user && data.user.type === "rider" && !data.profile) {
    return <Redirect href={"/profile"} />;
  }

  return (
    <Box className="h-full">
      <VStack space="md" className="h-full relative">
        <Box className="relative flex-1">
          <Image
            source={require("@/assets/images/mototaxi.png")}
            resizeMode="cover"
            className="w-full flex-1"
            alt="deliver"
          />
          <LinearGradient
            start={[0.3, 1]}
            // end at top-center
            end={[0.5, 0]}
            colors={[
              "white", // from-white
              "rgba(255,255,255,0.7)", // via-white/80
              "transparent", // to-transparent
            ]} // Bottom center
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              right: 0,
              left: 0,
              bottom: 0,
              top: 0,
              zIndex: 1,
              borderRadius: 16,
            }}
            // className="rounded-2xl"
          ></LinearGradient>
        </Box>

        <VStack
          className="px-4 flex-1 justify-end pb-4 absolute bottom-8 left-0 z-20 right-0
        "
          space="sm"
        >
          <Box>
            <Heading className="text-typography-900 font-heading" size="3xl">
              Deliver Package to
            </Heading>
            <Heading className="text-typography-900 font-heading" size="3xl">
              Any Destination
            </Heading>
          </Box>
          <Text className="text-typography-400 mb-5 font-bold">
            Deliver makes delivery safe, easy and convenient, Available in
            Kigali
          </Text>

          {data === undefined ? (
            <UPLoading />
          ) : (
            <Button size="xl" onPress={() => router.navigate("/login")}>
              <ButtonText className="text-xl font-body">Get started</ButtonText>
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
