/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  UP: {
    primary: "rgb(38 26 72)",
    background: "rgb(255, 255, 255)",
    card: "rgb(241, 241, 244)",
    text: "rgb(38, 26, 72)",
    border: "rgb(227, 226, 232)",
    borderDark: "rgb(123, 114, 142)",
    borderDarkest: "rgb(197 197 198)",
    notification: "rgb(255, 238, 209)",
    error: "rgb(255, 59, 48)",
    success: "rgb(52, 199, 89)",
    active: "#00ADF1",
    lightYellow: "rgb(252, 238, 213)",
    darkYellow: "rgb(134, 121, 88)",
    semiActive: "#F2FAFD",
    semiPrimary: "#E9E8EC",
  },
};
