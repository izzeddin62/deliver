import ActiveDelivery from "@/components/map/Active";
import UserMapIndexScreen from "@/components/map/Index";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { SafeAreaView } from "react-native";

export default function UserMapScreen() {
  const activeData = useQuery(
    api.lib.queries.deliveryRequests.ActiveDeliveryRequest
  );
  const delivery = activeData?.deliveryRequest;

  return (
    <SafeAreaView className="flex-1">
      {delivery ? <ActiveDelivery /> : <UserMapIndexScreen />}
    </SafeAreaView>
  );
}
