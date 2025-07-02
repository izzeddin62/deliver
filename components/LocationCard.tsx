import { ReactNode } from "react";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";

interface LocationCardProps {
  title: string;
  location: string | null;
  icon: ReactNode;
}

export default function LocationCard({
  title,
  location,
  icon,
}: LocationCardProps) {
  return (
    <Box className="flex-row items-center gap-3">
      <Box className="p-3 bg-secondary-200 rounded-full">{icon}</Box>

      <Box className="h-full justify-start ">
        <Heading className="text-sm">{title}</Heading>
        {location && <Text className="text-sm">{location}</Text>}
      </Box>
    </Box>
  );
}
