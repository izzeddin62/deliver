import { Box } from "@/components/ui/box";
import { ButtonText, Button as GButton } from "@/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { useAuthActions } from "@convex-dev/auth/react";
import { Stack, useRouter } from "expo-router";
import { Banknote, Bike, Map, Menu, X } from "lucide-react-native";
import { Fragment, useState } from "react";
import { Button, ListItem, Text } from "tamagui";

export default function Layout() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <Fragment>
      <Drawer
        isOpen={showDrawer}
        className="z-20"
        onClose={() => {
          setShowDrawer(false);
        }}
        size="lg"
        anchor="right"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader className="flex-row justify-end mt-6">
            <DrawerCloseButton>
              <X />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody>
            <Box className="gap-3">
              <Button
                onPress={() => {
                  router.navigate("/(app)/rider");
                  setShowDrawer(false);
                }}
              >
                <ListItem hoverTheme icon={Map} scaleIcon={1.5}>
                  Home
                </ListItem>
              </Button>
              <Button
                onPress={() => {
                  router.replace("/(app)/rider/deliveries");
                  setShowDrawer(false);
                }}
              >
                <ListItem hoverTheme icon={Bike} scaleIcon={1.5}>
                  My deliveries
                </ListItem>
              </Button>
              <Button
                onPress={() => {
                  router.replace("/(app)/rider/balance");
                  setShowDrawer(false);
                }}
              >
                <ListItem hoverTheme icon={Banknote} scaleIcon={1.5}>
                  My Balance
                </ListItem>
              </Button>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onPress={async (e) => {
                e.preventDefault();
                console.log("I clicked here");
                await signOut();
                setShowDrawer(false);
                router.navigate("/");
              }}
              className="flex-1"
            >
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerStyle: { backgroundColor: "#333333" },
            title: "",
            headerRight: () => (
              <Box>
                <GButton
                  variant="link"
                  className="w-fit"
                  onPress={() => setShowDrawer(true)}
                >
                  <ButtonText>
                    <Menu color={"white"} />
                  </ButtonText>
                </GButton>
              </Box>
            ),
          }}
        />
        <Stack.Screen
          name="deliveries"
          options={{
            headerTitle: () => <Text fontWeight={500}>Deliveries</Text>,
            headerRight: () => (
              <Box>
                <GButton
                  variant="link"
                  className="w-fit"
                  onPress={() => setShowDrawer(true)}
                >
                  <ButtonText>
                    <Menu />
                  </ButtonText>
                </GButton>
              </Box>
            ),
          }}
        />

        <Stack.Screen
          name="delivery"
          options={{
            headerTitle: () => <Text fontWeight={500}>Delivery</Text>,
            headerRight: () => (
              <Box>
                <GButton
                  variant="link"
                  className="w-fit"
                  onPress={() => setShowDrawer(true)}
                >
                  <ButtonText>
                    <Menu />
                  </ButtonText>
                </GButton>
              </Box>
            ),
          }}
        />
        <Stack.Screen
          name="balance"
          options={{
            headerTitle: () => <Text fontWeight={500}>My Balance</Text>,
            headerRight: () => (
              <Box>
                <GButton
                  variant="link"
                  className="w-fit"
                  onPress={() => setShowDrawer(true)}
                >
                  <ButtonText>
                    <Menu />
                  </ButtonText>
                </GButton>
              </Box>
            ),
          }}
        />
      </Stack>
    </Fragment>
  );
}
