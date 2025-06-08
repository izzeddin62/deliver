import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { cn } from "@/lib/utils";
import { ScrollViewProps, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

type UPRootLayoutProps = ScrollViewProps & {
  isTopPadding?: boolean;
  isRightPadding?: boolean;
};

export default function UPRootLayout({
  children,
  className,
  isTopPadding = true,
  isRightPadding = true,
  ...props
}: UPRootLayoutProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const bottom = useBottomTabOverflow();
  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ bottom }}
      contentContainerStyle={{ paddingBottom: bottom }}
      className={cn(
        "pl-4 flex flex-col",
        {
          "pt-[42px]": isTopPadding,
          "pr-4": isRightPadding,
        },
        className
      )}
      {...props}
    >
      {children}
    </Animated.ScrollView>
  );
}

export function UPRootLayoutModelContent({
  children,
  className,
  isTopPadding = true,
  noPaddingRight = false,
}: {
  children: React.ReactNode;
  className?: string;
  isTopPadding?: boolean;
  noPaddingRight?: boolean;
}) {
  return (
    <View
      className={cn(
        "px-4",
        {
          "pt-[54px]": isTopPadding,
          "pr-4": !noPaddingRight,
        },
        className
      )}
    >
      {children}
    </View>
  );
}