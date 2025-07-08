// import { useFonts } from "expo-font";
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import { Poppins_500Medium, Poppins_600SemiBold, Poppins_800ExtraBold, Poppins_900Black } from '@expo-google-fonts/poppins';
import { SplashScreen, Stack } from "expo-router";

import { useEffect } from 'react';
import "./globals.css";

export default function RootLayout() {
    const [loaded, error] = useFonts({
    Inter_900Black, Poppins_900Black, Poppins_800ExtraBold, Poppins_500Medium, Poppins_600SemiBold
  });

    useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  
  return <Stack initialRouteName='(tabs)' screenOptions={{ headerShown: false }} />;
}
