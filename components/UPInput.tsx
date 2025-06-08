import { Colors } from "@/constants/Colors";
import { UPRootLayoutModelContent } from "@/layouts/UPRootLayout";
import { cn } from "@/lib/utils";
import { autocompletePlacesQueries } from "@/services/autocomplete.places.service";
import { AddressData } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronLeft, MapPin, Search } from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    TextInput,
    TextInputProps,
    View
} from "react-native";
import { UPLoading } from "./UPLoader";
import UPText, { UPFontSize } from "./UPText";
  
  export type UPInputProps = TextInputProps & {
    isGeneral?: boolean;
    label?: string;
    error?: string;
    isOutLine?: boolean;
    isSmall?: boolean;
    isLast?: boolean;
    variant?: UPFontSize;
  };
  
  export default function UPInput({
    isGeneral = false,
    label,
    error,
    className,
    isOutLine,
    isSmall,
    isLast,
    variant = "body3",
    ...props
  }: UPInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    if (isOutLine) {
      return (
        <View className="flex flex-col gap-1 w-full">
          <View
            className={cn({
              "border-b flex items-center justify-between flex-row": true,
              "h-16": !isSmall,
              "h-12": isSmall,
              "border-border": !isLast && !error,
              "border-error": error,
              "border-b-transparent": isLast,
            })}
          >
            <UPText variant="body2" className="text-primary capitalize">
              {label}
            </UPText>
            <TextInput
              style={{
                fontFamily: "BrownPro",
                textAlign: "right",
              }}
              className={cn("flex-1", className)}
              {...props}
            />
          </View>
          {error && (
            <UPText variant="body3" className="text-error">
              *{error}
            </UPText>
          )}
        </View>
      );
    }
  
    if (!isGeneral) {
      return (
        <View className="flex flex-col gap-1 w-full">
          <TextInput
            style={{
              fontFamily: "BrownPro",
            }}
            className={cn(
              "border px-4 h-16 rounded-xl",
              {
                "border-active border-2": isFocused && !error,
                "border-border border": !isFocused && !error,
                "border-error border-2": error,
              },
              className
            )}
            {...props}
          />
          {error && (
            <UPText variant={variant} className="text-error">
              *{error}
            </UPText>
          )}
        </View>
      );
    }
    return (
      <View className="flex flex-col gap-1 w-full">
        {label && (
          <UPText variant={variant} className="text-primary capitalize">
            {label}
          </UPText>
        )}
        <View
          className={cn(
            "px-4 h-16 rounded-2xl w-full flex flex-col items-center justify-center",
            {
              "border-active border-2": isFocused && !error,
              "border-border border": !isFocused && !error,
              "border-error border-2": error,
            }
          )}
        >
          <View className="w-full flex flex-col gap-1">
            <TextInput
              style={{
                fontFamily: "BrownPro",
              }}
              {...props}
              placeholderTextColor={Colors.UP.primary}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>
        {error && (
          <UPText variant="body3" className="text-error">
            *{error}
          </UPText>
        )}
      </View>
    );
  }
  
  type UPInputSearchProps = TextInputProps & {
    isLoading?: boolean;
  };
  
  export function UPInputSearch({
    className,
    isLoading,
    ...props
  }: UPInputSearchProps) {
    return (
      <View
        className={cn(
          "flex flex-row items-center gap-2 bg-card rounded-xl px-4 h-12",
          className
        )}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.UP.borderDarkest} />
        ) : (
          <Search color={Colors.UP.borderDarkest} />
        )}
        <TextInput
          {...props}
          placeholder="Try searching by name."
          editable={!isLoading}
          style={{
            fontFamily: "BrownPro",
            color: isLoading ? Colors.UP.borderDarkest : Colors.UP.primary,
          }}
          className="flex-1"
        />
      </View>
    );
  }
  
  type UPInputLocationProps = UPInputProps & {
    onValueChange: (value: AddressData) => void;
  };
  export function UPInputLocation({
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
          <UPInput
            // {...props}
            label="Select Location"
            placeholder="Please click and search for location"
            className="text-right"
            error={error}
            editable={false}
            isGeneral={true}
            value={selectedValue || props.defaultValue}
            defaultValue={props.defaultValue}
            variant="h6"
          />
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
  
  type UPInputTimeDateAndroidProps = UPInputLocationProps & {
    modelHandler: {
      setHandler: React.Dispatch<React.SetStateAction<Date>>;
      value: Date;
      minDate: Date;
      maxDate: Date | undefined;
    };
    pickerDate: Date;
  };
  
  export function UPInputTimeDateAndroid({
    label,
    error,
    className,
    modelHandler,
    onValueChange,
    pickerDate,
    ...props
  }: UPInputTimeDateAndroidProps) {
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
          <UPInput
            // {...props}
            label={label}
            placeholder="Please click and search for location"
            className="text-right"
            error={error}
            editable={false}
            isGeneral={true}
            value={selectedValue || props.defaultValue}
            defaultValue={props.defaultValue}
            variant="h6"
          />
        </Pressable>
        {modelVisible && (
          <Modal visible={modelVisible} animationType="slide" transparent={true}>
            <View className="flex flex-col gap-2 items-center h-full bg-white rounded-xl">
              <DateTimePicker
                testID="dateTimePicker"
                value={modelHandler.value}
                minimumDate={modelHandler.minDate}
                mode={"datetime"}
                locale="en-US"
                display={"spinner"}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || pickerDate;
                  modelHandler.setHandler(currentDate);
                }}
              />
            </View>
          </Modal>
        )}
      </Fragment>
    );
  }