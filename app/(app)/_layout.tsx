import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import * as Location from "expo-location";
import { Redirect, Slot, usePathname } from "expo-router";
import { Box } from "lucide-react-native";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function Root() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const data = useQuery(api.lib.queries.users.currentUser);
  const pathname = usePathname();
  const updateRiderLocation = useMutation(
    api.lib.mutations.user.updateRiderLocation
  );

  // ——— EFFECT TO REQUEST LOCATION PERMISSION + GET CURRENT POSITION ———
  useEffect(() => {
    const getLocationData = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to use this feature."
        );
        return;
      }

      if (isAuthenticated) {
        const loc = await Location.getCurrentPositionAsync({});
        const { longitude, latitude } = loc.coords;
        await updateRiderLocation({
          location: {
            longitude,
            latitude,
          },
        });
      } else {
        return;
      }
    };

    getLocationData();
    const intervalId = setInterval(async () => {
      await getLocationData(); // Your geolocation logic
    }, 100000);

    return () => {
      clearInterval(intervalId); // Clear the interval on cleanup

      updateRiderLocation({
        location: null,
      });
    };
  }, [isAuthenticated, updateRiderLocation]);


  if (!isLoading && !isAuthenticated) {
    return <Redirect href={"/login"} />;
  }
  if (
    data &&
    data.user &&
    data.user.type === undefined &&
    pathname !== "/category"
  ) {
    return <Redirect href={"/category"} />;
  }

  if (
    data &&
    data.user &&
    data.user.type === "user" &&
    !pathname.includes("/user")
  ) {
    return <Redirect href={"/user"} />;
  }
  if (
    data &&
    data.user &&
    data.user.type === "rider" &&
    !data.profile &&
    pathname !== "/profile"
  ) {
    return <Redirect href={"/(app)/profile"} />;
  }

  if (
    data &&
    data.user &&
    data.user.type === "rider" &&
    data.profile &&
    !pathname.includes("/rider")
  ) {
    return <Redirect href={"/rider"} />;
  }

  if (data === undefined) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }
  return <Slot></Slot>;
}
