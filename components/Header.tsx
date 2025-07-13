import { useGameStore } from "@/store/game.store";
import { usePathname } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import Timer from "./Timer";

const Header: React.FC = () => {
  const { teamGameStarted, gameStarted } = useGameStore();
  const pathname = usePathname();

  const isTeamGameplayRoute = pathname === "/team-gameplay";
  const isGameplayRoute = pathname === "/gameplay";

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

        {/* Only show Timer on /team-gameplay */}
        {isTeamGameplayRoute && teamGameStarted && (
          <Timer isActive={teamGameStarted} mode="team" />
        )}

        {isGameplayRoute && gameStarted && (
          <Timer isActive={gameStarted} mode="game" />
        )}
      </View>
    </View>
  );
};

export default Header;
