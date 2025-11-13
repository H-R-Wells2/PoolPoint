import ActivitySheet from "@/components/ActivitySheet";
import ConfirmSubmitModal from "@/components/ConfirmSubmitModal";
import FloatingButton from "@/components/FloatingButton";
import PlayerCard from "@/components/PlayerCard";
import { useGameStore } from "@/store/game.store";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

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
      showMessage({
        message: "Error",
        description: "Failed to submit result. Try again.",
        type: "danger",
        backgroundColor: "#ef4444",
        color: "white",
      });
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
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

          <FloatingButton onPress={openSheet} />
          <ActivitySheet ref={bottomSheetRef} />

          <ConfirmSubmitModal
            visible={showConfirmModal}
            submitting={submitting}
            onCancel={() => setShowConfirmModal(false)}
            onConfirm={submitResult}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default GamePlay;
