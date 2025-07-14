import React from "react";
import { Text, View } from "react-native";

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
}

const ResultCard: React.FC<ResultCardProps> = ({ result, isAdmin = false }) => {
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

  // Check if this is a team game: any player has isTeamWon defined
  const isTeamGame = result.players.some(
    (player) => player.isTeamWon !== undefined
  );

  // If team game, group players by team
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
    <View className="bg-slate-800 w-[90vw] mx-auto mb-4 p-5 rounded-lg shadow-md shadow-black/50">
      {/* Header with date and optional delete */}
      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-xs text-gray-300">
          {formatDateString(result.date)}
        </Text>
        {isAdmin && (
          <Text className="text-red-400 text-xs font-semibold cursor-pointer">
            Delete
          </Text>
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
                          <Text
                            className="text-yellow-400 mx-2"
                            style={{ fontFamily: "Inter_500Medium" }}
                          >
                            ₹{player.amount ?? "-"}
                          </Text>
                          <Text
                            className="text-white font-bold"
                            style={{ fontFamily: "Inter_600SemiBold" }}
                          >
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
                  ? sortedPlayers.length === 2 ? "Draw" : "Tied Top Score"
                  : isTopScorer
                    ? "Winner"
                    : "Better luck next time";

              const bgClass =
                isDraw && isTopScorer && sortedPlayers.length === 2
                  ? "bg-[#2e374d] border border-slate-400"
                  : isTopScorer
                    ? "bg-green-900/50 border border-green-500"
                    : sortedPlayers.length === 2 ? "bg-red-900/50 border border-red-500" : "bg-[#2e374d] border border-slate-400";

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
                      className="text-white"
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

                  <Text
                    className="text-yellow-400 font-semibold"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    ₹{player.amount ?? "-"}
                  </Text>
                  <Text
                    className="text-white font-bold ml-4"
                    style={{ fontFamily: "Inter_600SemiBold" }}
                  >
                    {player.score}
                  </Text>
                </View>
              );
            });
          })()}
        </View>
      )}
    </View>
  );
};

export default ResultCard;
