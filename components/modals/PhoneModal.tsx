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
import { Button, Label } from "tamagui";
import { z } from "zod";
import DInput from "../DInput";
import { Box } from "../ui/box";

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

export default function PhoneModal({ deliveryId }: { deliveryId: Id<"deliveryRequests"> }) {
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
        contactNumber: data.contactNumber
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  }

  return (
    <Fragment>
      <Button
        theme={"black"}
        className="ml-1"
        marginInlineStart={8}
        onPress={() => {
          setShowModal(true);
        }}
      >
        Pay
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Mobile Money
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
              We need to collect the mobile money number for the delivery number
              and the contact person number before proceeding with the delivery.
            </Text>

            <Box className="mt-4 gap-4">
              <Box key="mobile-money-number">
                <Label marginBlockEnd={8} size={"$4"} lineHeight={18}>
                  Mobile money number
                </Label>
                <Controller
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Your phone number"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={errors.phoneNumber?.message}
                    />
                  )}
                  name="phoneNumber"
                />
              </Box>
              <Box key="contact-number">
                <Label marginBlockEnd={8} size={"$4"} lineHeight={18}>
                  Delivery Contact Number
                </Label>
                <Controller
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DInput
                      placeholder="Your contact number"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                      error={errors.contactNumber?.message}
                    />
                  )}
                  name="contactNumber"
                />
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => {
              setShowModal(false)
            }}>Cancel</Button>
            <Button
              theme={"black"}
              className="ml-0"


              onPress={handleSubmit(updateDeliveryStatus)}
            >
              Pay
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
