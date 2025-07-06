import { Bike } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import {
    Defs,
    Ellipse,
    FeBlend,
    FeColorMatrix,
    FeComposite,
    FeFlood,
    FeGaussianBlur,
    FeOffset,
    Filter,
    G,
    Path,
    Svg
} from "react-native-svg";

export default function MotoTaxiMarker({
  coordinate,
}: {
  coordinate: {
    latitude: number;
    longitude: number;
  };
}) {
  return (
    <Marker coordinate={coordinate}>
      <View style={styles.wrapper}>
        <Svg width="52" height="60" viewBox="0 0 52 60" fill="none">
          <G filter="">
            <Ellipse
              cx="26"
              cy="53.5"
              rx="7"
              ry="2.5"
              fill="black"
              fill-opacity="0.2"
            />
          </G>
          <G filter="">
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M26 4C37.598 4 47 13.402 47 25C47 33.8926 41.4727 41.4942 33.6663 44.5567L27.1961 53.4007C27.0612 53.5858 26.8821 53.7369 26.6739 53.8412C26.4657 53.9455 26.2346 54 26 54C25.7654 54 25.5343 53.9455 25.3261 53.8412C25.1179 53.7369 24.9388 53.5858 24.8039 53.4007L18.3337 44.5567C10.5273 41.4941 5 33.8926 5 25C5 13.402 14.402 4 26 4Z"
              fill="white"
            />
          </G>
          <Path
            d="M43 25C43 15.6112 35.3888 8 26 8C16.6112 8 9 15.6112 9 25C9 34.3888 16.6112 42 26 42C35.3888 42 43 34.3888 43 25Z"
            fill="#3478F5"
          />
          <Defs>
            <Filter
              id="filter0_f_14_118"
              x="17"
              y="49"
              width="18"
              height="9"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <FeFlood flood-opacity="0" result="BackgroundImageFix" />
              <FeBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <FeGaussianBlur
                stdDeviation="1"
                result="effect1_foregroundBlur_14_118"
              />
            </Filter>
            <Filter
              id="filter1_d_14_118"
              x="0"
              y="0"
              width="52"
              height="60"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <FeFlood flood-opacity="0" result="BackgroundImageFix" />
              <FeColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <FeOffset dy="1" />
              <FeGaussianBlur stdDeviation="2.5" />
              <FeComposite in2="hardAlpha" operator="out" />
              <FeColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <FeBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_14_118"
              />
              <FeBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_14_118"
                result="shape"
              />
            </Filter>
          </Defs>
        </Svg>
        
        <View style={styles.iconContainer}>
          <Bike size={20} color="#fff" />
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 48,
    height: 64,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "transparent"
  },
  iconContainer: {
    position: "absolute",
    top: 13,
    left: 13,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
