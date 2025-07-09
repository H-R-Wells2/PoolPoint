import PlayerCard from "@/components/PlayerCard";
import { useGameStore } from "@/store/game.store";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const GamePlayScreen = () => {
  const {
    team1Name,
    team1Players,
    team1Score,
    setTeam1Score,

    team2Name,
    team2Players,
    team2Score,
    setTeam2Score,

    gameStarted,
    resetGame,
  } = useGameStore();

  const handleSubmit = () => {
    console.log("Game Submitted:", {
      team1: { name: team1Name, players: team1Players, score: team1Score },
      team2: { name: team2Name, players: team2Players, score: team2Score },
    });

    resetGame();

    router.replace('/(tabs)/history')
  };

  return (
    <ScrollView>
      <View className="flex-1 items-center mt-8">
        {!gameStarted ? (
          <Text className="text-white text-xl mt-20">Start the game from setup tab first.</Text>
        ) : (
          <View className="w-full flex flex-col justify-center items-center px-4 gap-6">
            <PlayerCard
              name={team1Name}
              players={team1Players}
              score={team1Score}
              setScore={setTeam1Score}
            />
            <PlayerCard
              name={team2Name}
              players={team2Players}
              score={team2Score}
              setScore={setTeam2Score}
            />

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-teal-500 p-3 rounded-lg w-full max-w-[90vw]"
            >
              <Text className="text-white text-lg text-center font-semibold" style={{fontFamily:"Poppins_600SemiBold"}}>Submit Game</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default GamePlayScreen;
