import { KeyboardTypeOptions } from "react-native";
import { Input, Text } from "tamagui";
import { Box } from "./ui/box";

interface DInputProps {
  error?: string;
  onBlur?: () => void;
  onChange?: (...event: any[]) => void;
  value?: string;
  helperText?: string;
  placeholder?: string;

  keyboardType?: KeyboardTypeOptions
}

export default function DInput({
  onBlur,
  value,
  onChange,
  error,
  helperText,
  placeholder,
  keyboardType

}: DInputProps) {
  return (
    <Box className="h-fit">
      <Input
        placeholder={placeholder}
        onBlur={onBlur}
        keyboardType={keyboardType}
        onChangeText={(value) => onChange?.(value)}
        value={value}
      />
      {!!(helperText || error) && (
        <Box className="mt-2 ">
          <Text color={error ? "$red9" : "$accent10"}>
            {error ?? helperText}
          </Text>
        </Box>
      )}
    </Box>
  );
}
