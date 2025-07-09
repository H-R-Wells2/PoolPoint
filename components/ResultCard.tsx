import React from "react";
import { Text, View } from "react-native";

interface Player {
  playerName: string;
  score: number;
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

  return (
    <View className="bg-slate-800 w-[90vw] mx-auto mb-4 p-5 rounded-lg">
      {/* Top section with date and optional delete */}
      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-xs text-gray-300">
          {formatDateString(result.date)}
        </Text>
        {isAdmin && (
          <Text className="text-red-400 text-xs">Delete</Text> // Replace with delete component
        )}
      </View>

      {/* Players list sorted by score */}
      <View className="flex-col">
        {result.players
          .sort((a, b) => b.score - a.score)
          .map((player, index) => {
            const playerColor =
              player.isTeamWon === true
                ? "text-green-400"
                : player.isTeamWon === false
                  ? "text-red-400"
                  : "text-gray-300";

            return (
              <View
                key={index}
                className="flex-row justify-between w-[75%] self-center my-1"
              >
                <Text
                  className={`flex-1 ${playerColor}`}
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  {index + 1}. {player.playerName}
                </Text>
                <Text
                  className={`${playerColor}`}
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  {player.score}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default ResultCard;
