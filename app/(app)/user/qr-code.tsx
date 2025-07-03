import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QrCode() {
  const currentUser = useQuery(api.lib.queries.users.currentUser);
  if (currentUser === null) {
    return <Redirect href="/login" />;
  }
  if (!currentUser) {
    return (
      <Box className="items-center w-full justify-center flex-1 bg-white">
        <UPLoading />
      </Box>
    );
  }

  const user = currentUser.user;

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="items-center w-full flex-1 justify-center bg-white pt-10">
        <QRCode
          value={user._id}
          size={300}
          color="black"
          backgroundColor="white"
        />
        <Box className="w-full items-center mb-6 mt-5">
          <Text size="xl" className="text-center">
            Scan this code
          </Text>
          <Heading className="font-semibold" size="xl">
            {user.email}
          </Heading>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
