import PlayerCard from "@/components/PlayerCard";
import { useGameStore } from "@/store/game.store";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TeamGamePlay = () => {
  const {
    team1Name,
    team1Players,
    team1Score,
    setTeam1Score,

    team2Name,
    team2Players,
    team2Score,
    setTeam2Score,

    totalTableAmount,

    gameStarted,
    resetGame,
  } = useGameStore();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const team1Won = team1Score > team2Score;
      const team2Won = team2Score > team1Score;
      const draw = team1Score === team2Score;

      const winningAmount = totalTableAmount * 0.3;
      const losingAmount = totalTableAmount * 0.7;

      const team1PlayerCount = team1Players.length;
      const team2PlayerCount = team2Players.length;

      const team1IsWinner = team1Won && !draw;
      const team2IsWinner = team2Won && !draw;

      let team1AmountPerPlayer: number;
      let team2AmountPerPlayer: number;

      if (totalTableAmount === 120) {
        // Manual override for ₹120 case: 20, 20, 40, 40
        const winnerAmount = 40;
        const loserAmount = 20;

        if (team1IsWinner) {
          team1AmountPerPlayer = winnerAmount;
          team2AmountPerPlayer = loserAmount;
        } else if (team2IsWinner) {
          team1AmountPerPlayer = loserAmount;
          team2AmountPerPlayer = winnerAmount;
        } else {
          const drawAmount =
            totalTableAmount / (team1PlayerCount + team2PlayerCount);
          team1AmountPerPlayer = drawAmount;
          team2AmountPerPlayer = drawAmount;
        }
      } else {
        team1AmountPerPlayer = team1IsWinner
          ? winningAmount / team1PlayerCount
          : losingAmount / team1PlayerCount;

        team2AmountPerPlayer = team2IsWinner
          ? winningAmount / team2PlayerCount
          : losingAmount / team2PlayerCount;
      }

      // Build player objects (with amount calculation)
      const team1BaseScore = Math.floor(team1Score / team1PlayerCount);
      const team1Remainder = team1Score % team1PlayerCount;

      const team2BaseScore = Math.floor(team2Score / team2PlayerCount);
      const team2Remainder = team2Score % team2PlayerCount;

      let allPlayers: {
        playerName: string;
        score: number;
        amount: number;
        isTeamWon: boolean;
      }[] = [];

      // Step 1: Create all player objects with floored amounts
      let rawPlayers = [
        ...team1Players.map((player, index) => ({
          playerName: player,
          score: draw
            ? team1Score / team1PlayerCount
            : index < team1Remainder
              ? team1BaseScore + 1
              : team1BaseScore,
          amount: draw
            ? totalTableAmount / (team1PlayerCount + team2PlayerCount)
            : Math.floor(team1AmountPerPlayer),
          isTeamWon: draw ? true : team1IsWinner,
        })),
        ...team2Players.map((player, index) => ({
          playerName: player,
          score: draw
            ? team2Score / team2PlayerCount
            : index < team2Remainder
              ? team2BaseScore + 1
              : team2BaseScore,
          amount: draw
            ? totalTableAmount / (team1PlayerCount + team2PlayerCount)
            : Math.floor(team2AmountPerPlayer),
          isTeamWon: draw ? false : team2IsWinner,
        })),
      ];

      // Step 2: Fix rounding error by adjusting total amount
      if (!draw) {
        const totalAssigned = rawPlayers.reduce((sum, p) => sum + p.amount, 0);
        const remainder = totalTableAmount - totalAssigned;

        // Distribute remaining 1-2 rupees starting from the top (or winners first)
        for (let i = 0; i < remainder; i++) {
          rawPlayers[i % rawPlayers.length].amount += 1;
        }
      }

      allPlayers = rawPlayers;

      const response = await fetch(
        "https://poolpoint-backend.vercel.app/api/results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ players: allPlayers }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit game");

      resetGame();
      router.replace("/(tabs)/history");
    } catch (error) {
      console.error("Error submitting game:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 items-center my-8">
        {!gameStarted ? (
          <Text className="text-white text-xl mt-20">
            Start the game from setup tab first.
          </Text>
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

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-teal-500 p-3 rounded-lg w-full max-w-[90vw] flex items-center justify-center"
              disabled={submitting}
              style={{ opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" className="py-0.5" />
              ) : (
                <Text
                  className="text-white text-lg text-center font-semibold"
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                >
                  Submit Game
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TeamGamePlay;
