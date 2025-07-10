import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import "./globals.css";

import {
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_900Black,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_800ExtraBold,
  Poppins_900Black,
  useFonts as usePoppinsFonts,
} from "@expo-google-fonts/poppins";

export default function RootLayout() {
  const [iconsLoaded, setIconsLoaded] = useState(false);

  const [interLoaded] = useInterFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_900Black,
  });

  const [poppinsLoaded] = usePoppinsFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  useEffect(() => {
    Font.loadAsync(Ionicons.font)
      .then(() => setIconsLoaded(true))
      .catch((e) => console.warn("Ionicons font load error", e));
  }, []);

  useEffect(() => {
    if (interLoaded && poppinsLoaded && iconsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, poppinsLoaded, iconsLoaded]);

  const allLoaded = interLoaded && poppinsLoaded && iconsLoaded;

  if (!allLoaded) return null;

  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} />
  );
}
