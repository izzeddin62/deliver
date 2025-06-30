import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { UPLoading } from "@/components/UPLoader";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { ConvexError } from "convex/values";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Pressable,
  Button as RButton,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { z } from "zod";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const toast = useToast();
  const router = useRouter();
  const ref = useRef<CameraView>(null);
  const [disableScanner, setDisableScanner] = useState(false);
  // const addFriend = useMutation(api.lib.mutations.friends.addFriend);
  const { mutateAsync: addFriend, isPending } = useMutation({
    mutationFn: useConvexMutation(api.lib.mutations.friends.addFriend),
    onSuccess: (data) => {
      toast.closeAll();
      setDisableScanner(false);
      const schema = z.object({
        message: z.string(),
        success: z.boolean(),
      });
      const parsedData = schema.safeParse(data);
      if (!parsedData.success) {
        return router.replace("/(app)/user/friends");
      }

      if (parsedData.data.success) {
        toast.show({
          placement: "top",
          render: () => (
            <Toast action="success">
              <ToastTitle>Friend added</ToastTitle>
              <ToastDescription>
                You have successfully added a friend
              </ToastDescription>
            </Toast>
          ),
        });
      }
      router.replace("/(app)/user/friends");
    },
    onError: (error) => {
      toast.closeAll();
      console.log("ArgumentValidationError:-------------------", error.message);
      if (error.message.includes("ArgumentValidationError")) {
        console.log("ArgumentValidationError:", error.message);
        toast.show({
          placement: "top",
          render: () => (
            <Toast action="warning">
              <ToastTitle>Handoff status</ToastTitle>
              <ToastDescription>
                There was an issue while adding your friend. please try again in
                a moment
              </ToastDescription>
            </Toast>
          ),
        });
        setDisableScanner(false);
        router.replace("/(app)/user/friends");
        return;
      }
      if (error instanceof ConvexError) {
        toast.show({
          placement: "top",
          render: () => (
            <Toast action="warning">
              <ToastTitle>Handoff status</ToastTitle>
              <ToastDescription>
                There was an issue while adding your friend. please try again in
                a moment
              </ToastDescription>
            </Toast>
          ),
        });
        
        setDisableScanner(false);
        router.replace("/(app)/user/friends");
      }
    },
  });

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

  const closeCamera = () => {
    router.replace("/(app)/user/friends");
  };

  const handleQRScan = async (barcode: BarcodeScanningResult) => {
    if (disableScanner) return;
    setDisableScanner(true);
    await addFriend({
      friendId: barcode.data as Id<"users">,
    });
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={"picture"}
        facing={"back"}
        mute={false}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        responsiveOrientationWhenOrientationLocked
        onBarcodeScanned={handleQRScan}
      >
        <View style={styles.shutterContainer}>
          <Pressable onPress={closeCamera}>
            <X size={32} color="white" />
          </Pressable>
        </View>
        {isPending && (
          <View style={styles.loadingContainer}>
            <UPLoading color="white" />
          </View>
        )}
      </CameraView>
    );
  };

  return <View style={styles.container}>{renderCamera()}</View>;
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
    top: 16,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
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
    padding: 10,
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },

  loadingContainer: {
    position: "absolute",
    zIndex: 50,
    inset: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 20,
  },
});
