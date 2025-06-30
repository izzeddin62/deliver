import DInput from "@/components/DInput";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Pressable, SafeAreaView, ScrollView } from "react-native";
import { Button, H4, Label, Text } from "tamagui";
import { z } from "zod";

const UserSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(/^(?:0(?:72|73|78|79)\d{7}|\+250(?:72|73|78)\d{7})$/, {
      message:
        "Phone number must be a valid Rwandan number starting 078 or 073 or 072 or 079",
    }),
});

type UserData = z.infer<typeof UserSchema>;

export default function Index() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });

  async function submit(data: UserData) {
   await signIn("resend-otp", data);
  }

  return (
    <SafeAreaView>
      <ScrollView className="bg-background-light px-4">
        <VStack>
          <Pressable
            className="w-12 h-12 rounded-full bg-background-100 items-center justify-center mt-4"
            onPress={() => router.back()}
          >
            <MoveLeft size={20} color={"black"} />
          </Pressable>

          <Box className="mt-8 mb-5">
            <H4>Sign up to Deliver</H4>
            <Text color={"$accent1"}>
              Sign up and get access to our delivery network
            </Text>
          </Box>
          <Box className="gap-5 mt-4">
            <Box>
              <Label marginBlockEnd={8} size={"$6"} lineHeight={18}>
                First name
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DInput
                    placeholder="e.g: John"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={errors.firstName?.message}
                  />
                )}
                name="firstName"
              />
            </Box>
            <Box>
              <Label marginBlockEnd={8} size={"$6"} lineHeight={18}>
                last name
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DInput
                    placeholder="e.g: Ishimwe"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={errors.lastName?.message}
                  />
                )}
                name="lastName"
              />
            </Box>
            <Box>
              <Label size={"$6"} lineHeight={18} marginBlockEnd={8}>
                Phone number
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DInput
                    placeholder="Your Number"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    error={errors.phoneNumber?.message}
                    helperText="Please add your mobile money number."
                  />
                )}
                name="phoneNumber"
              />
            </Box>
            <Box>
              <Label marginBlockEnd={8} size={"$6"} lineHeight={18}>
                Email
              </Label>
              <Controller
                control={control}
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
          </Box>

          <Button
            className="my-4"
            marginBlock={24}
            onPress={handleSubmit(submit)}
            theme="black"
          >
            Signup
          </Button>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
