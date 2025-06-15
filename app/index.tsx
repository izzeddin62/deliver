import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import {
  useConvexAuth,
  useQuery
} from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { Button } from "tamagui";

export default function Index() {
  const router = useRouter();
  const data = useQuery(api.lib.queries.users.currentUser);
  const { isAuthenticated } = useConvexAuth()
  console.log("isauth true: ", isAuthenticated, '=====================', data)

  if (data && data.user && data.user.type === undefined) {
    return <Redirect href={"/category"} />;
  }

  if (data && data.user && data.user.type === "user") {
    return <Redirect href={"/user/deliveries"} />;
  }

  if (data && data.user && data.user.type === "rider" && data.profile) {
    return <Redirect href={"/rider"} />;
  }

  if (data && data.user && data.user.type === "rider" && !data.profile) {
    return <Redirect href={"/profile"} />;
  }

  return (
    <Box className="h-full">
      <VStack space="md" className="h-full">
        <Image
          source={require("@/assets/images/splash-icon.png")}
          className="w-full h-fit"
          alt="deliver"
        />

        <VStack className="px-4 flex-1 justify-end pb-4" space="sm">
          {data === undefined ? (
            <UPLoading />
          ) : (
            <Button theme="black" onPress={() => router.navigate("/login")}>
              Get started
            </Button>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
