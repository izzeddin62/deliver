import { Colors } from "@/constants/Colors";
import { UPRootLayoutModelContent } from "@/layouts/UPRootLayout";
import { autocompletePlacesQueries } from "@/services/autocomplete.places.service";
import { AddressData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  Loader,
  MapPin,
  Search,
} from "lucide-react-native";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  View,
} from "react-native";
import { UPInputProps, UPInputSearch } from "./UPInput";
import { UPLoading } from "./UPLoader";
import UPText from "./UPText";
import { Box } from "./ui/box";
import { Input, InputField } from "./ui/input";
import { Text } from "./ui/text";

type UPInputLocationProps = UPInputProps & {
  onValueChange: (value: AddressData) => void;
  isLoading: boolean;
};
export function SearchLocation({
  label,
  error,
  className,
  isLoading,
  onValueChange,
  ...props
}: UPInputLocationProps) {
  const [modelVisible, setModelVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop(); // Optional cleanup
  }, [spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Fragment>
      <Pressable
        onPress={() => {
          setModelVisible(true);
        }}
        className="w-full"
      >
        <Box className="bg-background-light w-full h-14 flex-row items-center justify-between gap-2 rounded-full pl-5 pr-1 shadow-lg">
          <Text className="text-typography-700 font-body">
            {" "}
            {!selectedValue ? "Your package destination" : selectedValue}{" "}
          </Text>
          <Box className="justify-center items-center aspect-square h-12 w-12 rounded-full bg-primary-500">
            {isLoading ? (
              <Animated.View style={{ transform: [{ rotate }] }}>
                <Loader color={"white"} size={18} />
              </Animated.View>
            ) : (
              <Search color={"white"} strokeWidth={3} size={18} />
            )}
          </Box>
        </Box>
      </Pressable>

      <UPInputLocationModel
        modelVisible={modelVisible}
        value={selectedValue}
        setModelVisible={setModelVisible}
        onChange={(val) => {
          setModelVisible(false);
          setSelectedValue(val.formatted_address);
          onValueChange(val);
        }}
      />
    </Fragment>
  );
}

type UPInputLocationModelProps = {
  modelVisible: boolean;
  setModelVisible: (value: boolean) => void;
  onChange?: (value: AddressData) => void;
  value?: string;
};
function UPInputLocationModel({
  modelVisible,
  setModelVisible,
  onChange,
  value,
}: UPInputLocationModelProps) {
  const [search, setSearch] = useState("");
  const [bounceName, setBounceName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setBounceName(search);
    }, 1100);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const { data: places, isLoading: isLoadingPlaces } = useQuery(
    autocompletePlacesQueries.all({
      q: bounceName,
    })
  );

  return (
    <Modal visible={modelVisible} animationType="slide" transparent={true}>
      <View className="flex flex-col gap-2 items-center h-full bg-white rounded-xl">
        <View className="flex items-center justify-between w-full flex-row pt-[54px]">
          <Pressable
            onPress={() => {
              setModelVisible(false);
            }}
            hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
            className="flex-row items-center justify-start"
          >
            <ChevronLeft
              color={Colors.UP.primary}
              width={24}
              height={24}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
          <View>
            <UPText variant="h4" className="text-primary capitalize">
              Select Location
            </UPText>
          </View>

          <View className="w-10" />
        </View>
        <UPRootLayoutModelContent className="w-full" isTopPadding={false}>
          <UPInputSearch
            value={search}
            isLoading={isLoadingPlaces}
            onChangeText={(text) => setSearch(text)}
            className="mt-2"
            autoFocus
          />
          <Box className="relative bg-background-50 pt-6 rounded-sm pb-1">
            <Text className="absolute top-2 left-2.5 text-sm font-semibold text-typography-400 border-0">To</Text>
            <Input className="bg-transparent relative border-0">
              <InputField placeholder="Destination" />
            </Input>
          </Box>

          {isLoadingPlaces ? (
            <View className="mt-4">
              <UPLoading />
            </View>
          ) : (
            <View className="w-full">
              <FlatList
                data={places ?? []}
                style={{
                  width: "100%",
                }}
                keyExtractor={(item, index) =>
                  item.place_id ?? index.toString()
                }
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setModelVisible(false);
                      onChange?.({ ...item });
                    }}
                    className="px-4 w-full py-4 border-b border-border flex flex-row justify-between"
                  >
                    <View className="flex items-center flex-row gap-2">
                      <MapPin size={18} color={Colors.UP.primary} />
                      <UPText
                        variant="body2"
                        className="text-primary capitalize"
                      >
                        {item.formatted_address}
                      </UPText>
                    </View>

                    {value === item.formatted_address && (
                      <Check
                        size={18}
                        className="text-primary"
                        color={Colors.UP.primary}
                      />
                    )}
                  </Pressable>
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </UPRootLayoutModelContent>
      </View>
    </Modal>
  );
}
