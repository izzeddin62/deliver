import { Colors } from "@/constants/Colors";
import { UPRootLayoutModelContent } from "@/layouts/UPRootLayout";
import { cn } from "@/lib/utils";
import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

type UPLoaderProps = ActivityIndicatorProps & {
  isSmall?: boolean;
};
export default function UPLoader({
  size = "small",
  isSmall = false,
  
  ...rest
}: UPLoaderProps) {
  return (
    <UPRootLayoutModelContent
      className={cn({
        "flex items-center justify-center h-full": !isSmall,
        "flex items-center justify-center": isSmall,
      })}
    >
      <ActivityIndicator size="small" color={Colors.UP.primary} {...rest} />
    </UPRootLayoutModelContent>
  );
}

export function UPFullScreenLoader({
  children,
  isLoading,
  position = "center",
}: {
  children: React.ReactNode;
  isLoading: boolean;
  position?: "center" | "top" | "bottom";
}) {
  const isCenter = position === "center";
  const isTop = position === "top";
  const isBottom = position === "bottom";

  return (
    <View className="flex items-center justify-center w-full">
      {isLoading && isTop && (
        <View className="w-full items-center justify-center my-4">
          <ActivityIndicator size="small" color={Colors.UP.primary}  />
        </View>
      )}
      <View className="w-full h-full">
        {children}
        {isLoading && isBottom && (
          <View className="w-full items-center justify-center">
            <UPLoader />
          </View>
        )}
      </View>
      {isLoading && isCenter && (
        <View className="absolute z-50 inset-0 flex items-center justify-center">
          <UPLoader />
        </View>
      )}
    </View>
  );
}


export function UPLoading(){
  return (
    <View>
      <ActivityIndicator size="small" color={Colors.UP.primary} />
    </View>
  );
}