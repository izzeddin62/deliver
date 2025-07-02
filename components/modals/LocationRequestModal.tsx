import React from "react";
import { Pressable } from "react-native";

import { Box } from "@/components/ui/box";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Bell, X } from "lucide-react-native";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

type User = Doc<"users">;
type LocationRequest = Doc<"friendLocationRequests">;

interface LocationRequestModalProps {
  friendWhoSentRequest: User;
  locationRequest: LocationRequest;
}
export default function LocationRequestModal({
  friendWhoSentRequest,
  locationRequest,
}: LocationRequestModalProps) {
    const acceptLocationRequest = useMutation(
      api.lib.mutations.friends.acceptFriendLocationRequest
    );
    const rejectLocationRequest = useMutation(
      api.lib.mutations.friends.rejectFriendLocationRequest
    );
  return (
    <Box className="bg-background-100 absolute top-2 shadow-lg h-fit right-10 left-10 z-20 pt-5 pb-3 px-3 rounded-[24px]">
      <Pressable
        className="absolute top-3 right-3 p-2 bg-secondary-400 rounded-full"
        onPress={async () => {
          await rejectLocationRequest({
            requestId: locationRequest?._id,
          });
        //   setDestination(null);
        }}
      >
        <X size={20} strokeWidth={1} />
      </Pressable>
      <Box className="w-full flex-row justify-center mb-6 mt-3">
        <Box className="bg-secondary-400 p-4 rounded-full">
          <Bell size={28} className="mb-2" strokeWidth={1} />
        </Box>
      </Box>
      <Heading className="text-base font-medium text-center">
        You have a location request
      </Heading>
      <Box className="flex-row gap-2 items-center mt-2">
        <Text className="text-center">
          {friendWhoSentRequest?.email} wants to know your location
        </Text>
      </Box>
      <Box className="flex-row gap-1 items-center mt-4 w-full">
        <Button
          size="lg"
          className="ml-1 flex-1"
          onPress={async () => {
            await acceptLocationRequest({
              requestId: locationRequest?._id,
            });
          }}
        >
          <ButtonText>Confirm</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
