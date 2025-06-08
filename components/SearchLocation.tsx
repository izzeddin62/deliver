import { Colors } from "@/constants/Colors";
import { UPRootLayoutModelContent } from "@/layouts/UPRootLayout";
import { autocompletePlacesQueries } from "@/services/autocomplete.places.service";
import { AddressData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
    Check,
    ChevronLeft,
    LocationEditIcon,
    MapPin
} from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import { FlatList, Modal, Pressable, View } from "react-native";
import { UPInputProps, UPInputSearch } from "./UPInput";
import { UPLoading } from "./UPLoader";
import UPText from "./UPText";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

type UPInputLocationProps = UPInputProps & {
  onValueChange: (value: AddressData) => void;
};
export function SearchLocation({
  label,
  error,
  className,
  onValueChange,
  ...props
}: UPInputLocationProps) {
  const [modelVisible, setModelVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  return (
    <Fragment>
      <Pressable
        onPress={() => {
          setModelVisible(true);
        }}
        className="w-full"
      >
        <Box className="bg-background-light w-full h-10 rounded border border-background-400 flex-row items-center gap-2">
          <Box className="justify-center items-center w-10 border-r h-full border-primary-50">
            <LocationEditIcon color={"#808080"} size={18} />
          </Box>
          <Text size="sm"> {!selectedValue ? "your package destination" : selectedValue} </Text>
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
          {isLoadingPlaces ? (
            <View className="mt-4">
              <UPLoading />
            </View>
          ) : (
            <View className="w-full">
              <FlatList
                data={places}
                style={{
                  width: "100%",
                }}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setModelVisible(false);
                      onChange?.(item);
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
