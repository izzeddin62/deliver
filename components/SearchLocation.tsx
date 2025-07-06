import { Colors } from "@/constants/Colors";
import { UPRootLayoutModelContent } from "@/layouts/UPRootLayout";
import { autocompletePlacesQueries } from "@/services/autocomplete.places.service";
import { AddressData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  Loader,
  LocationEdit,
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
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
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

  console.log(places?.[0]?.address_components?.[0], "=======");

  return (
    <Modal visible={modelVisible} animationType="slide" transparent={true} className="">
      <View className="flex flex-col gap-2 items-center h-full bg-white pt-5 rounded-xl">
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
            <Heading  className="text-primary capitalize font-medium">
              Select Location
            </Heading>
          </View>

          <View className="w-10" />
        </View>
        <UPRootLayoutModelContent className="w-full pt-4" isTopPadding={false}>
          <UPInputSearch
            value={search}
            isLoading={isLoadingPlaces}
            onChangeText={(text) => setSearch(text)}
            className="mt-2"
            autoFocus
          />

          {isLoadingPlaces ? (
            <View className="mt-4">
              <UPLoading />
            </View>
          ) : (
            <View className="w-full mt-8">
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
                    className="px-- w-full py-4 flex flex-row justify-between"
                  >
                    <View className="flex items-start flex-row gap-4 w-full ">
                      <Box className="p-3 bg-secondary-200 rounded-full relative top-1">
                        <LocationEdit size={20} color={"#666666"} />
                      </Box>
                      <Box className="flex-1  border-b border-b-background-200 pb-4">
                        <Heading
                          // variant="body2"

                          className="text-primary capitalize text-base font-semibold"
                        >
                          {item.address_components?.[0]?.short_name}
                        </Heading>
                        <Text
                          // variant="body2"
                          className="text-primary text-sm text-typography-600"
                        >
                          {item.address_components?.[0]?.long_name}
                        </Text>
                      </Box>
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
