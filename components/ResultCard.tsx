import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

interface Player {
  playerName: string;
  score: number;
  amount?: number;
  isTeamWon?: boolean;
}

interface Result {
  _id: string;
  date: string;
  players: Player[];
}

interface ResultCardProps {
  result: Result;
  isAdmin?: boolean;
  onDeleteSuccess?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onDeleteSuccess }) => {
  const [showDelete, setShowDelete] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLongPress = () => {
    setShowDelete(true);

    // Vibration.vibrate(100);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setShowDelete(false);
    }, 3000);
  };

  const handleDelete = async () => {
    Alert.alert("Delete", "Are you sure you want to delete this result?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `https://poolpoint-backend.vercel.app/api/results/${result._id}`,
              { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to delete");

            // console.log("Deleted:", result._id);
            onDeleteSuccess?.();
          } catch (err) {
            console.error("Delete error:", err);
            Alert.alert(
              "Error",
              "Failed to delete the result. Please try again."
            );
          }
        },
      },
    ]);
  };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    };

    const formattedDate = date.toLocaleDateString(undefined, options);
    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

    return `${formattedDate} - ${time}`;
  };

  const isTeamGame = result.players.some(
    (player) => player.isTeamWon !== undefined
  );

  const teams = isTeamGame
    ? result.players.reduce(
        (acc, player) => {
          const key = player.isTeamWon ? "won" : "lost";
          if (!acc[key]) acc[key] = [];
          acc[key].push(player);
          return acc;
        },
        { won: [] as Player[], lost: [] as Player[] }
      )
    : null;

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={1000}
    >
      <View className="bg-slate-800 w-[90vw] mx-auto mb-4 p-5 rounded-lg shadow-md shadow-black/50">
        <View className="mb-4 flex-row justify-between items-center relative">
          <Text className="text-xs text-gray-300">
            {formatDateString(result.date)}
          </Text>
          {showDelete && (
            <MaterialIcons
              name="delete"
              size={25}
              color="#f87171"
              onPress={handleDelete}
              className="absolute right-2 -mt-2 p-0.5 rounded-full border-slate-300 border"
            />
          )}
        </View>

        {isTeamGame ? (
          // TEAM GAME VIEW
          (() => {
            const teamWon = teams!.won;
            const teamLost = teams!.lost;

            const totalWon = teamWon.reduce((sum, p) => sum + p.score, 0);
            const totalLost = teamLost.reduce((sum, p) => sum + p.score, 0);

            const isDraw = totalWon === totalLost;

            return (
              <View className="flex-row justify-around gap-3">
                {["won", "lost"].map((teamKey) => {
                  const teamPlayers = teams![teamKey as "won" | "lost"];
                  if (teamPlayers.length === 0) return null;

                  const teamColorClass = isDraw
                    ? "bg-[#181f31] border border-slate-400"
                    : teamKey === "won"
                      ? "bg-green-900/50 border border-green-500"
                      : "bg-red-900/50 border border-red-500";

                  const titleColorClass = isDraw
                    ? "text-slate-300"
                    : teamKey === "won"
                      ? "text-green-400"
                      : "text-red-500";

                  const titleText = isDraw
                    ? "Well Played"
                    : teamKey === "won"
                      ? "Winning Team"
                      : "Losing Team";

                  return (
                    <View
                      key={teamKey}
                      className={`flex-1 p-3 rounded-lg ${teamColorClass}`}
                    >
                      <Text
                        className={`text-center mb-2 font-semibold ${titleColorClass}`}
                        style={{ fontFamily: "Inter_600SemiBold" }}
                      >
                        {titleText}
                      </Text>

                      {teamPlayers
                        .sort((a, b) => b.score - a.score)
                        .map((player, idx) => (
                          <View
                            key={`${player.playerName}-${idx}`}
                            className="flex-row justify-between items-center py-1"
                          >
                            <Text
                              className="text-white flex-1"
                              style={{ fontFamily: "Inter_500Medium" }}
                            >
                              {idx + 1}. {player.playerName}
                            </Text>
                            <Text className="text-yellow-400 mx-2 font-semibold">
                              ₹{player.amount ?? "-"}
                            </Text>
                            <Text className="text-white font-semibold">
                              {player.score}
                            </Text>
                          </View>
                        ))}

                      {/* Total team score */}
                      <View className="mt-3 border-t border-slate-500 pt-2 flex-row justify-between items-center">
                        <Text
                          className="text-right text-sm text-slate-300 font-semibold"
                          style={{ fontFamily: "Inter_500Medium" }}
                        >
                          Total Points:
                        </Text>
                        <Text
                          className="text-right text-sm text-slate-300 font-semibold"
                          style={{ fontFamily: "Inter_500Medium" }}
                        >
                          {teamPlayers.reduce((sum, p) => sum + p.score, 0)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })()
        ) : (
          // INDIVIDUAL GAME VIEW
          <View className="p-3 rounded-lg bg-[#181f31] border border-slate-400">
            <Text
              className="text-center mb-3 font-semibold text-teal-400"
              style={{ fontFamily: "Inter_600SemiBold" }}
            >
              Player Scores
            </Text>

            {(() => {
              const sortedPlayers = [...result.players].sort(
                (a, b) => b.score - a.score
              );
              const topScore = sortedPlayers[0]?.score ?? 0;
              const drawPlayers = sortedPlayers.filter(
                (p) => p.score === topScore
              );
              const isDraw = drawPlayers.length > 1;

              return sortedPlayers.map((player, idx) => {
                const isTopScorer = player.score === topScore;

                const label =
                  isDraw && isTopScorer
                    ? sortedPlayers.length === 2
                      ? "Draw"
                      : "Tied Top Score"
                    : isTopScorer
                      ? "Winner"
                      : "Better luck next time";

                const bgClass =
                  isDraw && isTopScorer && sortedPlayers.length === 2
                    ? "bg-[#2e374d] border border-slate-400"
                    : isTopScorer
                      ? "bg-green-900/50 border border-green-500"
                      : sortedPlayers.length === 2
                        ? "bg-red-900/50 border border-red-500"
                        : "bg-[#2e374d] border border-slate-400";

                const textClass =
                  isDraw && isTopScorer
                    ? "text-slate-300"
                    : isTopScorer
                      ? "text-green-400"
                      : "text-slate-400";

                return (
                  <View
                    key={`${player.playerName}-${idx}`}
                    className={`flex-row justify-between items-center py-2 px-3 rounded-md mb-2 ${bgClass}`}
                  >
                    <View className="flex-1">
                      <Text
                        className="text-white mr-2"
                        style={{ fontFamily: "Inter_500Medium" }}
                      >
                        {idx + 1}. {player.playerName}
                      </Text>
                      <Text
                        className={`text-xs mt-1 ${textClass}`}
                        style={{ fontFamily: "Inter_500Medium" }}
                      >
                        {label}
                      </Text>
                    </View>

                    <View className="flex-row items-center min-w-[20%] justify-between">
                      <Text className="text-yellow-400 font-semibold">
                        ₹{player.amount ?? "-"}
                      </Text>
                      <Text className="text-white font-semibold">
                        {player.score}
                      </Text>
                    </View>
                  </View>
                );
              });
            })()}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ResultCard;
