import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Redirect } from "expo-router";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const data = useQuery(
    api.lib.queries.users.currentUser,
    isLoading || (!isLoading && !isAuthenticated) ? "skip" : {}
  );

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

  return children;
}
