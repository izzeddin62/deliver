import { Box } from "@/components/ui/box";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { H5, Paragraph } from "tamagui";

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
    <Box className="items-center w-full flex-1 bg-white pt-10">
      <Box className="w-full items-center mb-6">
        <Paragraph text={"center"} size={"$7"}>
          Scan this code
        </Paragraph>
        <H5 text={"center"} fontWeight={500}>
          {user.email}
        </H5>
      </Box>

      <QRCode
        value={user._id}
        size={200}
        color="black"
        backgroundColor="white"
      />
    </Box>
  );
}
