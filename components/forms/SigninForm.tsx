import DInput from "@/components/DInput";
import { GoogleIcon } from "@/components/icons/GoogleLogo";
import { Box } from "@/components/ui/box";

import { VStack } from "@/components/ui/vstack";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexAuth } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H4, Label, Spinner, Text } from "tamagui";
import { z } from "zod";

const UserSchema = z.object({
  email: z.string().email(),
});
const CodeSchema = z.object({
  code: z.string().min(8),
});

type UserData = z.infer<typeof UserSchema>;
type CodeData = z.infer<typeof CodeSchema>;

export default function SigninForm() {
  const router = useRouter();
  const { signIn, signOut } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const [state, setState] = useState<"signin" | { email: string }>("signin");
  const [complete, setComplete] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });

  const {
    handleSubmit: handleCodeSubmit,
    control: codeControl,
    formState: { errors: codeErrors, isSubmitting: isCodeSubmitting },
  } = useForm({
    resolver: zodResolver(CodeSchema),
  });

  async function submit(data: UserData) {
    await signIn("resend-otp", data);
    setState(data);
  }

  async function submitCode(data: CodeData) {
    if (state !== "signin") {
      const { signingIn } = await signIn("resend-otp", { ...state, ...data });
      if (signingIn) {
        setComplete(true);
      }
    }
  }

  const isCodeSubmitLoading = isCodeSubmitting && !isAuthenticated;

  if (complete && isAuthenticated) {
    return <Redirect href={"/category"} />;
  }
  return (
    <SafeAreaView>
      <ScrollView className="bg-background-light px-4">
        <VStack>
          <H4
            fontWeight={500}
            className="my-8"
            marginBlockStart={56}
            marginBlockEnd={16}
          >
            Sign in or Create your account
          </H4>
          <Box className="">
            <Button>
              <GoogleIcon />
              Google
            </Button>

            <Box className="flex-row items-center gap-2 mt-3 mb-6">
              <Box className="flex-1 bg-background-200 h-[1px]"></Box>
              <Text color={"$accent9"}>Or Continue with</Text>
              <Box className="flex-1 bg-background-200 h-[1px]"></Box>
            </Box>
            {state === "signin" ? (
              <Box key="email">
                <Label marginBlockEnd={8} size={"$6"} lineHeight={18}>
                  Email
                </Label>
                <Controller
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Your email"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={errors.email?.message}
                    />
                  )}
                  name="email"
                />
              </Box>
            ) : (
              <Box>
                <Label
                  marginBlockEnd={8}
                  size={"$6"}
                  lineHeight={18}
                  key="code"
                >
                  Code
                </Label>
                <Controller
                  control={codeControl}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Code"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={codeErrors.code?.message}
                    />
                  )}
                  name="code"
                />
              </Box>
            )}
          </Box>
          {state === "signin" ? (
            <Button
              marginBlockStart={16}
              onPress={handleSubmit(submit)}
              icon={isSubmitting ? <Spinner /> : null}
              theme={"black"}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading" : "Send Code"}
            </Button>
          ) : (
            <Button
              marginBlockStart={16}
              onPress={handleCodeSubmit(submitCode)}
              theme={"black"}
              icon={isCodeSubmitLoading ? <Spinner /> : null}
              disabled={isCodeSubmitLoading}
            >
              {isCodeSubmitLoading ? "loading" : "Continue"}
            </Button>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
