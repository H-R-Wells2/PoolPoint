import PlayerCard from "@/components/PlayerCard";
import { useGameStore } from "@/store/game.store";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

const GamePlay: React.FC = () => {
  const router = useRouter();
  const { playerNames, setPlayerNames, playerScores, setPlayerScores } =
    useGameStore();

  const calculateAmounts = (count: number): number[] => {
    switch (count) {
      case 2:
        return [50, 50];
      case 3:
        return [25, 32, 43];
      default:
        return Array.from({ length: count }, (_, i) => (i + 1) * 10);
    }
  };

  const submitResult = async () => {
    const sorted = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);
    const amounts = calculateAmounts(sorted.length);

    const players = sorted.map(([playerName, score], i) => ({
      playerName,
      score,
      amount: amounts[i],
    }));

    try {
      const res = await fetch(
        "https://poolpoint-backend.vercel.app/api/results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ players }),
        }
      );

      if (!res.ok) throw new Error();

      setPlayerNames([]);
      setPlayerScores({});
      router.replace("/history");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert("Error", "Failed to submit result. Try again.");
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 items-center my-8">
        <View className="w-full flex flex-col justify-center items-center px-4 gap-6">
          {playerNames.map((name, index) => (
            <PlayerCard
              key={index}
              name={name}
              score={playerScores[name] ?? 0}
              setScore={(newScore) =>
                setPlayerScores({ ...playerScores, [name]: newScore })
              }
            />
          ))}

          <TouchableOpacity
            onPress={submitResult}
            className="bg-teal-500 p-3 rounded-lg w-full max-w-[90vw] flex items-center justify-center"
          >
            <Text
              className="text-white text-lg text-center font-semibold"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Submit Result
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default GamePlay;
