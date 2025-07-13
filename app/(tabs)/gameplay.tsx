/* eslint-disable @typescript-eslint/no-unused-vars */
import PlayerCard from "@/components/PlayerCard";
import { useGameStore } from "@/store/game.store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GamePlay: React.FC = () => {
  const router = useRouter();
  const {
    playerNames,
    setPlayerNames,
    playerScores,
    setPlayerScores,
    totalTableAmount,
    resetGame,
  } = useGameStore();

  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const calculateAmounts = (count: number): number[] => {
    switch (count) {
      case 2:
        return [50, 50];
      case 3:
        return [25, 32, 43];
      case 4:
        return [10, 20, 30, 40];
      default:
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
    setSubmitting(true);

    const sorted = Object.entries(playerScores).sort((a, b) => b[1] - a[1]) as [
      string,
      number,
    ][];

    const percentages: number[] = calculateAmounts(sorted.length);

    const rawAmounts: number[] = percentages.map((p) =>
      Math.floor((p / 100) * totalTableAmount)
    );

    const totalSoFar = rawAmounts.reduce((sum, amt) => sum + amt, 0);
    const remainder = totalTableAmount - totalSoFar;
    rawAmounts[rawAmounts.length - 1] += remainder;

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
      resetGame();
      router.replace("/history");
    } catch (error) {
      Alert.alert("Error", "Failed to submit result. Try again.");
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
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
              onPress={() => setShowConfirmModal(true)}
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

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="none"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-[90vw] max-w-md shadow-lg">
            <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
              Are you sure you want to submit the result?
            </Text>

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-300 rounded-md flex-1 mr-2"
                onPress={() => setShowConfirmModal(false)}
              >
                <Text className="text-center text-gray-800 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2 bg-teal-500 rounded-md flex-1 ml-2"
                disabled={submitting}
                onPress={submitResult}
                style={{ opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" className="py-0.5" />
                ) : (
                  <Text className="text-center text-white font-medium">
                    Confirm
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GamePlay;
