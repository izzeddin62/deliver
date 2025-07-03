import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import { LogOut, User, UserRound } from "lucide-react-native";
import { Pressable, SafeAreaView } from "react-native";

export default function UserProfile() {
  const user = useQuery(api.lib.queries.users.currentUser);
  const { signOut } = useAuthActions();
  if (user === null) {
    return <Redirect href={"/login"} />;
  }

  if (!user) {
    return (
      <SafeAreaView className="bg-white flex-1">
        <Box className="flex-1 justify-center items-center">
          <UPLoading />
        </Box>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-white flex-1">
      <Box className="flex-1 bg-background-100 relative">
        <Box className="w-full px-3 bg-background-0 py-4 gap-3">
          <Heading size="xl">Profile</Heading>
          <Box className="flex-row items-center gap-2">
            <Box className="p-3 bg-[#f1f2f4] rounded-full relative -left-1">
              <UserRound size={24} strokeWidth={1} />
            </Box>
            <Box>
              <Text className="font-medium">{user.user?.email}</Text>
            </Box>
          </Box>
        </Box>

        <Box className="bg-white mt-3 py-5 px-3">
          <Pressable className="flex-row items-center gap-2">
            <Box className="p-2.5 bg-[#f1f2f4] rounded-full relative -left-1">
              <User size={18} strokeWidth={1} />
            </Box>
            <Box>
              <Heading className="font-medium text-sm">Profile</Heading>
              <Text className="text-sm text-typography-400">
                Id, driver license, and more information
              </Text>
            </Box>
          </Pressable>
        </Box>

        <Box className="bg-white mt-3 py-5 flex-1 px-3">
          <Pressable
            onPress={() => signOut()}
            className="flex-row items-center gap-2"
          >
            <Box className="p-2.5 bg-[#f1f2f4] rounded-full relative -left-1">
              <LogOut size={18} strokeWidth={1} />
            </Box>
            <Text className="font-medium">Logout</Text>
          </Pressable>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
