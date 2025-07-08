import Header from "@/components/Header";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
  return (
    <SafeAreaView className="flex-1 bg-[#111827]">
      <Header />
      <Slot />    
    </SafeAreaView>
  );
}
