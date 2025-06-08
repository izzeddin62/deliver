import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import React from "react";
import { Text, TextProps } from "react-native";

export type UPFontSize =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "h7"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2"
  | "body3";

type UPTextProps = TextProps & {
  variant?: UPFontSize;

  color?:
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "warning"
    | "info"
    | "default";
};

const textVariants = cva("text-default", {
  variants: {
    variant: {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-bold",
      h3: "text-2xl font-bold",
      h4: "text-xl font-bold",
      h5: "text-lg font-bold",
      h6: "text-base font-bold",
      h7: "text-sm font-bold",
      subtitle1: "text-lg font-normal",
      subtitle2: "text-base font-normal",
      body1: "text-lg font-normal",
      body2: "text-base font-normal",
      body3: "text-sm font-normal",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
      default: "text-default",
    },
  },
  defaultVariants: {
    variant: "h1",
    color: "default",
  },
});

const fontFamilyWeight:  Record<UPFontSize, string> = {
  h1: "NunitoSans_700Bold",
  h2: "NunitoSans_700Bold",
  h3: "NunitoSans_700Bold",
  h4: "NunitoSans_700Bold",
  h5: "NunitoSans_700Bold",
  h6: "NunitoSans_700Bold",
  h7: "NunitoSans_700Bold",
  subtitle1: "NunitoSans_400Regular",
  subtitle2: "NunitoSans_400Regular",
  body1: "NunitoSans_400Regular",
  body2: "NunitoSans_400Regular",
  body3: "NunitoSans_400Regular",
}

export default function UPText({
  variant,
  color,
  className,
  ...rest
}: UPTextProps) {
  return (
    <Text
      {...rest}
      style={[
        rest.style,
        {
          fontFamily: fontFamilyWeight[variant ?? "body3"],
        },
      ]}
      className={cn(textVariants({ variant, color }), className)}
    />
  );
}