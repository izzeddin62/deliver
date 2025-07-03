import { TabTriggerSlotProps } from "expo-router/ui";
import { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

type TabButtonProps = TabTriggerSlotProps & {
  text: string;
  Icon: LucideIcon;
};
export default function TabButton({
  text,
  Icon,
  isFocused,
  ...props
}: TabButtonProps) {
  return (
    <Pressable {...props} className="flex-1 h-full">
      <Box className="w-full h-full flex-col justify-center items-center">
        <Icon size={24} color={isFocused ? "#0a0a0a" : "#737373"} />
        <Text
          className={`font-body ${isFocused ? "text-typography-900" : "text-typography-600"}  text-sm mt-1`}
        >
          {text}
        </Text>
      </Box>
    </Pressable>
  );
}
