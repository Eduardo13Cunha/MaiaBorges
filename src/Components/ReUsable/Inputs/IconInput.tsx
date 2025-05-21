import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps
} from "@chakra-ui/react";
import { ReactNode } from "react";

export interface IconInputProps<T> extends Omit<InputProps, "onChange" | "value"> {
  error?: string;
  onChange?: (s: T | undefined) => void;
  format?: (s: T) => string;
  value: T;
  title?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "string" | "date";
  icon: ReactNode;
}

export function IconInput<T>({
  error,
  value,
  title,
  format,
  onChange,
  icon,
  ...props
}: IconInputProps<T>) {
  return (
    <FormControl isInvalid={!!error}>
      {title && <FormLabel color="text.primary.100">{title}</FormLabel>}

      <InputGroup>
        {icon && <InputLeftElement color="text.primary.100" pointerEvents="none">{icon}</InputLeftElement>}

        <Input
          bg="bg.none"
          color="text.primary.100"
          type={props.type ?? "text"}
          value={formatData(value, format)}
          onChange={(e) => onChange?.(e.target.value as any)}
          borderRadius="md"
          _focus={{ borderColor: "bg.primary.100", boxShadow: "sm" }}
          {...props}
        />
      </InputGroup>

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}

function formatData<T>(val: T, formatter?: (val: T) => string): string {
  if (!val) return "";
  return formatter ? formatter(val) : String(val);
}
