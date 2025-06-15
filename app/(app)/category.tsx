import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { Button, H5, H6, Paragraph } from "tamagui";

export default function Category() {
  const mutate = useMutation(api.lib.mutations.user.updateUserType);
  const router = useRouter();

  return (
    <SafeAreaView>
      <Box className="items-center mt-4 w-full px-4">
        <H5 fontWeight={500}>Pick your category</H5>
        <Box className="mt-4 w-full gap-4">
          <Box className="relative">
            <Box className="relative w-full h-56 rounded-2xl">
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]}
                start={{ x: 0.5, y: 0 }} // Top center
                end={{ x: 0.5, y: 1 }} // Bottom center
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
                className="rounded-2xl"
              ></LinearGradient>
              <Image
                source={require("@/assets/images/user.jpg")}
                className="w-full h-56 block rounded-2xl"
              />
            </Box>

            <Box className="absolute right-0 left-0 bottom-0 flex-row z-10 px-4 pb-4 items-center justify-between">
              <Box>
                <H6 fontWeight={500} color={"white"}>
                  User
                </H6>
                <Paragraph color={"white"} fontWeight={500}>
                  I have a parcel to deliver
                </Paragraph>
              </Box>
              <Button
                theme={"black"}
                onPress={async () => {
                  await mutate({ type: "user" });
                  router.navigate("/user");
                }}
              >
                Select
              </Button>
            </Box>
          </Box>

          <Box className="relative">
            <Box className="relative w-full h-56 rounded-2xl">
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.4)"]}
                start={{ x: 0.5, y: 0 }} // Top center
                end={{ x: 0.5, y: 1 }} // Bottom center
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
                className="rounded-2xl"
              ></LinearGradient>
              <Image
                source={require("@/assets/images/rider.jpg")}
                className="w-full h-56 block rounded-2xl"
              />
            </Box>

            <Box className="absolute right-0 left-0 bottom-0 flex-row z-10 px-4 pb-4 items-center justify-between">
              <Box>
                <H6 fontWeight={500} color={"white"}>
                  Rider
                </H6>
                <Paragraph color={"white"} fontWeight={500}>
                  I can deliver parcels in Kigali
                </Paragraph>
              </Box>
              <Button
                theme={"black"}
                onPress={async () => {
                  await mutate({ type: "rider" });
                  router.navigate("/profile");
                }}
              >
                Select
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
