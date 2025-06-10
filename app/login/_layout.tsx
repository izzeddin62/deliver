import { Tabs } from "expo-router";
import { Bike, User } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "User",
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="rider"
        options={{
          title: "Riders",
          tabBarIcon: ({ color }) => <Bike color={color} size={28} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
