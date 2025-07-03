import React, { forwardRef } from "react";

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation } from "convex/react";
import { UserRound } from "lucide-react-native";
import { Pressable } from "react-native";
type User = Doc<"users">;

interface FriendListSheetProps {
  friends: User[];
  onClose?: () => void;
}

const FriendListSheet = forwardRef<BottomSheet, FriendListSheetProps>(
  ({ friends, onClose }, ref) => {
    const createLocationRequest = useMutation(
      api.lib.mutations.friends.createFriendLocationRequest
    );
    return (
      <BottomSheet
        ref={ref}
        enablePanDownToClose={true}
        onClose={() => {
          onClose?.();
        }}
        style={{
          boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: 16,
          zIndex: 99999,
        }}
      >
        <BottomSheetView className="px-3 pt-4 pb-16 gap-6">
          <Box>
            <Heading className="text-base mb-5">Select Friend</Heading>

            {friends.map((friend) => (
              <Pressable
                key={friend._id}
                onPress={async () => {
                  await createLocationRequest({ friendId: friend._id });
                  onClose?.();
                }}
                className="flex-row items-center gap-2 active:bg-secondary-100"
              >
                <Box className="p-2.5 bg-[#f1f2f4] rounded-full">
                  <UserRound size={18} />
                </Box>
                <Box>
                  <Text className="font-semibold">{friend.email}</Text>
                </Box>
              </Pressable>
            ))}
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

FriendListSheet.displayName = "FriendListSheet";
export default FriendListSheet;
