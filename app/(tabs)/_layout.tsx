import Header from "@/components/Header";
import { Slot } from "expo-router";
import FlashMessage from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
  return (
    <SafeAreaView className="flex-1 bg-[#111827]" edges={["top"]}>
      <FlashMessage position="top" statusBarHeight={28} />
      <Header />
      <Slot />
    </SafeAreaView>
  );
}
