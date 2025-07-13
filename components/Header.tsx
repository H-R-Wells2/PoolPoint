// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const Header: React.FC = () => {
  return (
    <View className="w-full fixed top-0 z-10 px-6 pb-4 pt-3">
      <View className="flex flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <View className="relative h-11 w-11">
            <Image
              source={require("../assets/images/icon.png")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 3,
              }}
            />
          </View>
          <Text
            style={{ fontFamily: "Poppins_600SemiBold" }}
            className="text-3xl mt-1 text-white"
          >
            Pool<Text className="text-teal-500">Point</Text>
          </Text>
        </View>

        {/* <Pressable onPress={() => router.push("/")}>
          <Ionicons name="person-circle-outline" size={38} color="#ffffff" />
        </Pressable> */}
      </View>
    </View>
  );
};

export default Header;
