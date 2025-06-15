import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useAuthToken } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { Redirect, Slot, usePathname } from "expo-router";
import { Box } from "lucide-react-native";

export default function Root() {
  
  const { isLoading, isAuthenticated } = useConvexAuth();
  const token = useAuthToken();
  console.log('isloading; ', isLoading, ", isAuthenticated: ", isAuthenticated, '============== the end of the query');
  const data = useQuery(api.lib.queries.users.currentUser);
  const pathname = usePathname();
  console.log(data, '===== at least the token is there');

  if (!isLoading && !isAuthenticated) {
    console.log("I am redirecting to login which I shouldn't");
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

  if (data && data.user && data.user.type === "user" && !pathname.includes("/user")) {

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
