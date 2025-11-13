import ConfirmSubmitModal from "@/components/ConfirmSubmitModal";
import FloatingButton from "@/components/FloatingButton";
import TeamActivitySheet from "@/components/TeamActivitySheet";
import TeamPlayerCard from "@/components/TeamPlayerCard";
import { useGameStore } from "@/store/game.store";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const TeamGamePlay = () => {
  const {
    team1Name,
    team1Players,
    team1Scores,
    setTeam1Scores,
    setTeam1Players,

    team2Name,
    team2Players,
    team2Scores,
    setTeam2Scores,
    setTeam2Players,

    isTeamLP,

    totalTableAmount,

    teamGameStarted,
    resetTeamGame,
  } = useGameStore();

  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const team1Total = team1Scores.reduce((sum, val) => sum + val, 0);
      const team2Total = team2Scores.reduce((sum, val) => sum + val, 0);

      const team1Won = team1Total > team2Total;
      const team2Won = team2Total > team1Total;
      const draw = team1Total === team2Total;

      const winningAmount = totalTableAmount * 0.3;
      const losingAmount = totalTableAmount * 0.7;

      const team1PlayerCount = team1Players.length;
      const team2PlayerCount = team2Players.length;

      const team1IsWinner = team1Won && !draw;
      const team2IsWinner = team2Won && !draw;

      let team1AmountPerPlayer: number;
      let team2AmountPerPlayer: number;

      if (draw) {
        const drawAmount =
          totalTableAmount / (team1PlayerCount + team2PlayerCount);
        team1AmountPerPlayer = drawAmount;
        team2AmountPerPlayer = drawAmount;
      } else if (isTeamLP) {
        team1AmountPerPlayer = team1IsWinner
          ? 0
          : totalTableAmount / team1PlayerCount;
        team2AmountPerPlayer = team2IsWinner
          ? 0
          : totalTableAmount / team2PlayerCount;
      } else if (totalTableAmount === 120) {
        const winnerAmount = 20;
        const loserAmount = 40;

        if (team1IsWinner) {
          team1AmountPerPlayer = winnerAmount;
          team2AmountPerPlayer = loserAmount;
        } else {
          team1AmountPerPlayer = loserAmount;
          team2AmountPerPlayer = winnerAmount;
        }
      } else {
        team1AmountPerPlayer = team1IsWinner
          ? winningAmount / team1PlayerCount
          : losingAmount / team1PlayerCount;

        team2AmountPerPlayer = team2IsWinner
          ? winningAmount / team2PlayerCount
          : losingAmount / team2PlayerCount;
      }

      let rawPlayers = [
        ...team1Players.map((player, index) => ({
          playerName: player,
          score: team1Scores[index],
          amount: draw
            ? totalTableAmount / (team1PlayerCount + team2PlayerCount)
            : Math.floor(team1AmountPerPlayer),
          isTeamWon: draw ? true : team1IsWinner,
        })),
        ...team2Players.map((player, index) => ({
          playerName: player,
          score: team2Scores[index],
          amount: draw
            ? totalTableAmount / (team1PlayerCount + team2PlayerCount)
            : Math.floor(team2AmountPerPlayer),
          isTeamWon: draw ? false : team2IsWinner,
        })),
      ];

      if (!draw) {
        const totalAssigned = rawPlayers.reduce((sum, p) => sum + p.amount, 0);
        const remainder = totalTableAmount - totalAssigned;

        for (let i = 0; i < remainder; i++) {
          rawPlayers[i % rawPlayers.length].amount += 1;
        }
      }

      const response = await fetch(
        "https://poolpoint-backend.vercel.app/api/results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ players: rawPlayers }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit game");

      setTimeout(() => {
        showMessage({
          message: "Success",
          description: `Game Submitted Successfully!`,
          type: "success",
          backgroundColor: "#14b8a6",
          color: "white",
        });
      }, 500);

      resetTeamGame();
      router.replace("/(tabs)/history");
    } catch (error) {
      console.error("Error submitting game:", error);

      setTimeout(() => {
        showMessage({
          message: "Error",
          description:
            "There was an issue while submitting the game. Try again!",
          type: "danger",
          backgroundColor: "#ef4444",
          color: "white",
        });
      }, 500);
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
              <View className="flex-1 items-center mb-8 mt-4 w-[90vw] mx-auto">
                {!teamGameStarted ? (
                  <Text className="text-white text-xl mt-20">
                    Start the game from setup tab first.
                  </Text>
                ) : (
                  <View className="w-full flex flex-col justify-center items-center gap-6">
                    <TeamPlayerCard
                      name={team1Name}
                      players={team1Players}
                      scores={team1Scores}
                      setScores={setTeam1Scores}
                      onPlayerNameChange={(index: number, newName: string) => {
                        const updated = [...team1Players];
                        updated[index] = newName;
                        setTeam1Players(updated);
                      }}
                    />

                    <TeamPlayerCard
                      name={team2Name}
                      players={team2Players}
                      scores={team2Scores}
                      setScores={setTeam2Scores}
                      onPlayerNameChange={(index: number, newName: string) => {
                        const updated = [...team2Players];
                        updated[index] = newName;
                        setTeam2Players(updated);
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => setShowConfirmModal(true)}
                      className="bg-teal-500 py-2.5 rounded-lg w-full flex items-center justify-center"
                    >
                      <Text
                        className="text-white text-lg text-center font-semibold"
                        style={{ fontFamily: "Poppins_600SemiBold" }}
                      >
                        Submit Game
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
          
          <FloatingButton onPress={openSheet} />
          <TeamActivitySheet ref={bottomSheetRef} />

          <ConfirmSubmitModal
            visible={showConfirmModal}
            submitting={submitting}
            onCancel={() => setShowConfirmModal(false)}
            onConfirm={handleSubmit}
          />
        </KeyboardAvoidingView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default TeamGamePlay;
