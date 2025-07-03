import TabButton from "@/components/TabButton";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { Contact, House, Package2, User } from "lucide-react-native";

export default function Layout() {
  return (
    <Tabs className="rounded-t-[20px]">
      <TabSlot />
      <TabList className="bg-background-0 h-24 justify-normal items-center">
        <TabTrigger
          name="profile"
          href={"/(app)/user/qr-code"}
          className="hidden"
        ></TabTrigger>
        <TabTrigger
          name="profile"
          href={"/(app)/user/scanner"}
          className="hidden"
        ></TabTrigger>
        <TabTrigger name="home" href="/" asChild>
          <TabButton text="Home" Icon={House} />
        </TabTrigger>
        <TabTrigger name="deliveries" href="/(app)/user/deliveries" asChild>
          <TabButton text="deliveries" Icon={Package2} />
        </TabTrigger>
        <TabTrigger name="friends" href="/(app)/user/friends" asChild>
          <TabButton text="Friends" Icon={Contact} />
        </TabTrigger>
        <TabTrigger name="profile" href={"/(app)/user/profile"} asChild>
          <TabButton text="Profile" Icon={User} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
