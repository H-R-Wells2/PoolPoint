/* eslint-disable @typescript-eslint/no-unused-vars */
import PlayerCard from "@/components/PlayerCard";
import { useGameStore } from "@/store/game.store";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

const GamePlay: React.FC = () => {
  const router = useRouter();
  const {
    playerNames,
    setPlayerNames,
    playerScores,
    setPlayerScores,
    totalTableAmount,
  } = useGameStore();

  // const totalTableAmount = 120;

  const calculateAmounts = (count: number): number[] => {
    switch (count) {
      case 2:
        return [50, 50];
      case 3:
        return [25, 32, 43];
      case 4:
        return [10, 20, 30, 40];
      default:
        // Spread 100 proportionally in descending order for more than 4 players
        const base = 100 / count;
        return Array.from({ length: count }, (_, i) =>
          Math.round(base * (count - i))
        );
    }
  };

  type PlayerScoreMap = Record<string, number>;

  type PlayerResult = {
    playerName: string;
    score: number;
    amount: number;
  };

  const submitResult = async (): Promise<void> => {
    const sorted = Object.entries(playerScores).sort((a, b) => b[1] - a[1]) as [
      string,
      number,
    ][]; // Tuple typing for Object.entries

    const percentages: number[] = calculateAmounts(sorted.length);

    // Step 1: Calculate raw amounts and round them down
    const rawAmounts: number[] = percentages.map((p) =>
      Math.floor((p / 100) * totalTableAmount)
    );

    // Step 2: Adjust the last player’s amount to match total
    const totalSoFar = rawAmounts.reduce((sum, amt) => sum + amt, 0);
    const remainder = totalTableAmount - totalSoFar;
    rawAmounts[rawAmounts.length - 1] += remainder;

    // Step 3: Create player result list
    const players: PlayerResult[] = sorted.map(([playerName, score], i) => ({
      playerName,
      score,
      amount: rawAmounts[i],
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
    } catch (error) {
      Alert.alert("Error", "Failed to submit result. Try again.");
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 items-center my-8">
        <View className="w-full flex flex-col justify-center items-center px-4 gap-4">
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
