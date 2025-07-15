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
    isLP,
  } = useGameStore();

  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const calculateAmounts = (count: number): number[] => {
    let basePercents: number[];

    if (count === 2) {
      const scores = Object.values(playerScores);
      const [score1, score2] = [scores[0] ?? 0, scores[1] ?? 0];

      if (isLP && score1 === score2) return [50, 50];
      if (isLP) return [0, 100];
      return [50, 50];
    }

    if (isLP && (count === 3 || count === 4)) {
      const sorted = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);
      const lowestScore = sorted[sorted.length - 1][1];

      const percentages = new Array(count).fill(0);
      const lowestIndexes = sorted
        .map(([_, score], i) => (score === lowestScore ? i : -1))
        .filter((i) => i !== -1);

      const share = Math.floor(100 / lowestIndexes.length);
      let remainder = 100 - share * lowestIndexes.length;

      lowestIndexes.forEach((idx, i) => {
        percentages[idx] = share + (i === 0 ? remainder : 0);
      });

      return percentages;
    }

    switch (count) {
      case 3:
        basePercents = [25, 32, 43];
        break;
      case 4:
        basePercents = [10, 20, 30, 40];
        break;
      default: {
        const base = 100 / count;
        basePercents = Array.from({ length: count }, (_, i) =>
          Math.round(base * (count - i))
        );
        break;
      }
    }

    const scoreMap = new Map<number, number[]>();
    const sorted = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([_, score], index) => {
      if (!scoreMap.has(score)) scoreMap.set(score, []);
      scoreMap.get(score)?.push(index);
    });

    const adjustedPercents: number[] = new Array(count).fill(0);

    scoreMap.forEach((indexes) => {
      const sum = indexes.reduce((acc, i) => acc + basePercents[i], 0);
      const avg = Math.floor(sum / indexes.length);
      const remainder = sum - avg * indexes.length;

      indexes.forEach((i, idx) => {
        adjustedPercents[i] = avg + (idx === 0 ? remainder : 0);
      });
    });

    return adjustedPercents;
  };

  type PlayerScoreMap = Record<string, number>;

  type PlayerResult = {
    playerName: string;
    score: number;
    amount: number;
  };

  const submitResult = async (): Promise<void> => {
    setSubmitting(true);

    try {
      const allScores: PlayerScoreMap = {};
      playerNames.forEach((name) => {
        const rawScore = playerScores[name];
        const safeScore =
          typeof rawScore === "number" && !isNaN(rawScore) ? rawScore : 0;
        allScores[name] = safeScore;
      });

      const sorted = Object.entries(allScores).sort((a, b) => b[1] - a[1]);

      const percentages: number[] = calculateAmounts(sorted.length);

      const rawAmounts: number[] = percentages.map((p) =>
        Math.floor((p / 100) * totalTableAmount)
      );

      const totalSoFar = rawAmounts.reduce((sum, amt) => sum + amt, 0);
      const remainder = totalTableAmount - totalSoFar;
      if (rawAmounts.length > 0) {
        rawAmounts[rawAmounts.length - 1] += remainder;
      }

      const players: PlayerResult[] = sorted.map(([playerName, score], i) => ({
        playerName,
        score,
        amount: rawAmounts[i] ?? 0,
      }));

      const res = await fetch(
        "https://poolpoint-backend.vercel.app/api/results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ players }),
        }
      );

      if (!res.ok) throw new Error("API response not OK");

      setPlayerNames([]);
      setPlayerScores({});
      resetGame();
      router.replace("/history");
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit result. Try again.");
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <ScrollView>
        <View className="flex-1 items-center mb-8 mt-4">
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
              className="bg-teal-500 p-2.5 rounded-lg w-full max-w-[90vw] flex items-center justify-center"
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
                className="px-4 py-2.5 bg-gray-300 rounded-md flex-1 mr-2"
                onPress={() => setShowConfirmModal(false)}
              >
                <Text className="text-center text-gray-800 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-4 py-2.5 bg-teal-500 rounded-md flex-1 ml-2"
                disabled={submitting}
                onPress={submitResult}
                style={{ opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
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
