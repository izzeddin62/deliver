import { ReactNode } from "react";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

interface LocationCardProps {
  title: string;
  location: string | null;
  icon: ReactNode;
  large?: boolean
}

export default function LocationCard({
  title,
  location,
  icon,
  large = false
}: LocationCardProps) {
  return (
    <Box className={`flex-row items-center gap-3`}>
      <Box className={`${large ? "p-4" : "p-3"} bg-secondary-200 rounded-full`}>{icon}</Box>

      <Box className={`h-full justify-start ${large ? "gap-1" : ""}`}>
        <Heading className={large ? "text-md": "text-sm"}>{title}</Heading>
        {location && <Text className={large ? "text-base" : "text-sm"}>{location}</Text>}
      </Box>
    </Box>
  );
}
