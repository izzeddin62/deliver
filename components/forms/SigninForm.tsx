import DInput from "@/components/DInput";
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
import { Text } from "tamagui";
import { z } from "zod";
import { GoogleIcon } from "../icons/GoogleLogo";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";

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
          <Heading
            className="mt-8 mb-5 text-typography-900 font-semibold font-heading"
            size="2xl"

          >
            Sign in or Create your account
          </Heading>
          <Box className="">
            <Button className="p-4 h-fit mb-2">
              <GoogleIcon />
              <ButtonText>Google</ButtonText>
            </Button>

            <Box className="flex-row items-center gap-2 mt-3 mb-6">
              <Box className="flex-1 bg-background-200 h-[1px]"></Box>
              <Text color={"$accent9"}>Or Continue with</Text>
              <Box className="flex-1 bg-background-200 h-[1px]"></Box>
            </Box>

            <Box className="mt-2">
              {state === "signin" ? (
                <Box key="email">
                  <Controller
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, onBlur, value } }) => (
                      <DInput
                        placeholder="Email"
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
          </Box>
          <Box className="mt-4">
            {state === "signin" ? (
              <Button
                onPress={handleSubmit(submit)}
                size={"xl"}
                disabled={isSubmitting}
              >
                {isSubmitting && <ButtonSpinner />}
                <ButtonText className=" ml-2">
                  {isSubmitting ? "Sending Code" : "Send Code"}
                </ButtonText>
              </Button>
            ) : (
              <Button
                onPress={handleCodeSubmit(submitCode)}
                size="xl"
                disabled={isCodeSubmitLoading}
                className="gap-2"
              >
                {isCodeSubmitLoading && <ButtonSpinner />}

                <ButtonText className="ml-2">
                  {isCodeSubmitLoading ? "loading" : "Continue"}
                </ButtonText>
              </Button>
            )}
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
