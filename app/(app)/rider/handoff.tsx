import { Box } from "@/components/ui/box";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { Redirect, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  Button as RButton,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Spinner } from "tamagui";

export default function Handoff() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const deliveryInfo = useQuery(
    api.lib.queries.riderAssignment.riderAssignment
  );
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const toast = useToast();
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const handoffPackage = useMutation(
    api.lib.mutations.deliveryRequests.handoffDelivery
  );
  const [isLoading, setIsLoading] = useState(false);

  const handoff = async () => {
    setIsLoading(true);
    if (uri && deliveryInfo?.deliveryRequest) {
      const postUrl = await generateUploadUrl();
      const filedata = await fetch(uri);
      if (!filedata.ok) {
        toast.show({
          placement: "top",
          render: () => (
            <Toast action="warning">
              <ToastTitle>Handoff status</ToastTitle>
              <ToastDescription>
                There was an issue while uploading your picture. please try
                again in a moment
              </ToastDescription>
            </Toast>
          ),
        });

        setIsLoading(false);
        return;
      }
      const blob = await filedata.blob();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "image/jpeg" }, // or the correct mime type
        body: blob,
      });
      const { storageId } = (await result.json()) as {
        storageId: Id<"_storage">;
      };
      await handoffPackage({
        deliveryId: deliveryInfo.deliveryRequest._id,
        image: storageId,
      });
      setIsLoading(false);
      router.navigate("/(app)/rider")
      toast.show({
        placement: "top",
        duration: 2000,
        render: () => (
          <Toast action="success">
            <ToastTitle>Handoff status</ToastTitle>
            <ToastDescription>Package handoff is complete</ToastDescription>
          </Toast>
        ),
      });
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <RButton onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (deliveryInfo === null) {
    return <Redirect href={"/login"} />;
  }

  if (!deliveryInfo) {
    return (
      <Box className="flex-1 items-center justify-center">
        <UPLoading />
      </Box>
    );
  }

  const { deliveryRequest, riderAssignment } = deliveryInfo;
  if (!deliveryRequest || !riderAssignment) {
    return <Redirect href={"/rider"} />;
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo?.uri ?? null);
  };

  const renderPicture = () => {
    return (
      <Box className="h-full w-full">
        <Box className="flex-1 max-h-[80%] w-full items-center">
          {uri ? (
            <Image
              source={{ uri }}
              contentFit="contain"
              style={{ aspectRatio: 1, flex: 1 }}
            />
          ) : null}
        </Box>
        <Box className=" w-full  px-5 py-10">
          <RButton onPress={() => setUri(null)} title="Take another picture" />

          <Button
            theme={"black"}
            onPress={handoff}
            icon={isLoading ? <Spinner /> : null}
          >
            {isLoading ? "Finishing handoff..." : "Finish Handoff"}
          </Button>
        </Box>
      </Box>
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={"picture"}
        facing={"back"}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
