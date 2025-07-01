import { KeyboardTypeOptions } from "react-native";

import { Box } from "./ui/box";
import { Input, InputField } from "./ui/input";
import { Text } from "./ui/text";

interface DInputProps {
  error?: string;
  onBlur?: () => void;
  onChange?: (...event: any[]) => void;
  value?: string;
  helperText?: string;
  placeholder?: string;

  keyboardType?: KeyboardTypeOptions;
}

export default function DInput({
  onBlur,
  value,
  onChange,
  error,
  helperText,
  placeholder,
  keyboardType,
}: DInputProps) {
  return (
    <Box className="h-fit">
      <Input variant="rounded" className="h-16 px-3">
        <InputField
          placeholder={placeholder}
          onBlur={onBlur}
          keyboardType={keyboardType}
          onChangeText={(value) => onChange?.(value)}
          value={value}
          
        />
      </Input>
      {!!(helperText || error) && (
        <Box className="mt-2 ">
          <Text>{error ?? helperText}</Text>
        </Box>
      )}
    </Box>
  );
}
