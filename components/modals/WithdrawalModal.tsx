import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import DInput from "../DInput";
import { Box } from "../ui/box";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { ChevronRight, Wallet2 } from "lucide-react-native";
import { Pressable } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { Toast, ToastDescription, ToastTitle, useToast } from "../ui/toast";

const schema = z.object({
  momoNumber: z
    .string()
    .min(10, "mobile money number must be at least 10 characters long"),

  amount: z.number().min(100, "Amount must be at least 100 RWF"),
});

export default function WithdrawalModal() {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const withdrawPaymet = useMutation(
    api.lib.mutations.payments.withdrawPayment
  );

  const withdrawMoney = async (data: z.infer<typeof schema>) => {
    try {
      await withdrawPaymet({
        number: data.momoNumber,
        amount: data.amount,
      });
      //   setShowModal(false);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { message: string };
        toast.show({
          placement: "top",
          duration: 2000,
          render: () => (
            <Toast action="error">
              <ToastTitle>Withdrawal failed</ToastTitle>
              <ToastDescription>{message}</ToastDescription>
            </Toast>
          ),
        });
      }
    }
  };

  return (
    <Fragment>
      <Pressable
        onPress={() => {
          setShowModal(true);
        }}
      >
        <Box className="w-full h-fit rounded-xl border-[#DCE0E5] border mt-16 p-4 flex-row gap-4">
          <Box className="p-4 bg-teal-400 rounded-full w-14 h-14 justify-center items-center">
            <Wallet2 />
          </Box>
          <Box className="flex-row items-center justify-between flex-1">
            <Box>
              <Text size="lg" className="text-typography-black">
                Withdraw Funds
              </Text>
              <Text className="text-[#637488] ">Send money instantly</Text>
            </Box>
            <ChevronRight />
          </Box>
        </Box>
      </Pressable>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="rounded-[24px] w-[90%]">
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
             Money  withdraw
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="sm" className="text-typography-500">
              Please provide your mobile money number and amount, you want to
              withdraw
            </Text>

            <Box className="mt-4 gap-4">
              <Box key="mobile-money-number">
                <Controller
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Your mobile money number"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={errors.momoNumber?.message}
                    />
                  )}
                  name="momoNumber"
                />
              </Box>
              <Box key="contact-number">
                <Controller
                  control={control}
                  defaultValue={100}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Amount"
                      onBlur={onBlur}
                      onChange={(value) => onChange(parseInt(value))}
                      value={String(value)}
                      error={errors.amount?.message}
                    />
                  )}
                  name="amount"
                />
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button className="ml-0" onPress={handleSubmit(withdrawMoney)}>
              <ButtonText>withdraw</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
