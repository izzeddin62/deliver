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

import { ButtonText, Button as GButton } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

const schema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 characters long"),
});

export default function PhoneModal({
  deliveryId,
}: {
  deliveryId: Id<"deliveryRequests">;
}) {
  const [showModal, setShowModal] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const updateStatus = useMutation(
    api.lib.mutations.deliveryRequests.payDeliveryAndAddPhone
  );

  const updateDeliveryStatus = async (data: z.infer<typeof schema>) => {
    try {
      await updateStatus({
        deliveryId,
        phoneNumber: data.phoneNumber,
        contactNumber: data.contactNumber,
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  return (
    <Fragment>
      <GButton
        size="xl"
        className="ml-1 flex-1"
        onPress={() => {
          setShowModal(true);
        }}
      >
        <ButtonText className="ml-2">Pay</ButtonText>
      </GButton>
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
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Heading  className="text-typography-950 text-center font-semibold">
              Mobile Money
            </Heading>
            <Text className="text-typography-500 text-center">
              We need Addition information to complete the payment.
            </Text>

            <Box className="mt-4 gap-4">
              <Box key="mobile-money-number">
                <Controller
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Momo number"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={errors.phoneNumber?.message}
                      keyboardType="phone-pad"
                      
                    />
                  )}
                  name="phoneNumber"
                />
              </Box>
              <Box key="contact-number">
                <Controller
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Delivery Contact Number"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={errors.contactNumber?.message}
                      keyboardType="phone-pad"
                    />
                  )}
                  name="contactNumber"
                />
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <GButton
              size="xl"
              className="flex-1"
              onPress={handleSubmit(updateDeliveryStatus)}
            >
              {/* {isPending && <ButtonSpinner />} */}
              <ButtonText className="ml-2">Confirm</ButtonText>
            </GButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
