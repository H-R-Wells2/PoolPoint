import PlayerCard from "@/components/PlayerCard"; // Assume PlayerCard is similar to your current component
import { useGameStore } from "@/store/game.store";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Game: React.FC = () => {
  const {
    team1Players,
    team2Players,
    team1Score,
    setTeam1Score,
    team2Score,
    setTeam2Score,
  } = useGameStore();

  const handleSubmit = () => {
    // Handle result submission logic here, including score submission
    router.replace("/history"); // Navigate to results screen
  };

  return (
    <ScrollView>
      <View className="flex-1 items-center mt-8">
        <View className="w-full flex flex-col justify-center items-center px-4 gap-6">
          <PlayerCard
            name="Team 1"
            players={team1Players}
            score={team1Score}
            setScore={setTeam1Score}
          />
          <PlayerCard
            name="Team 2"
            players={team2Players}
            score={team2Score}
            setScore={setTeam2Score}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-teal-500 p-3 rounded-lg w-full max-w-[90vw]"
          >
            <Text
              className="text-white text-lg text-center font-semibold"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Submit Game
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Game;
