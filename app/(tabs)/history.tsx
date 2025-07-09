import DateDropdownFilter from "@/components/DateDropdownFilter";
import ResultCard from "@/components/ResultCard";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from "react-native";

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

interface PlayerRank {
  [playerName: string]: number;
}

const HistoryScreen: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };

  const fetchHistory = async () => {
    setLoading(true);

    const url = selectedDate
      ? `https://poolpoint-backend.vercel.app/api/dateResults/${selectedDate}`
      : `https://poolpoint-backend.vercel.app/api/results`;

    try {
      const resp = await fetch(url);
      const json = await resp.json();
      const fetchedResults: Result[] = json.data || [];

      setResults(fetchedResults);

      // Extract unique dates when loading all data
      if (!selectedDate) {
        const allDates = fetchedResults.map((r) => formatDate(r.date));
        const unique = Array.from(new Set(allDates));
        setUniqueDates(unique);
      }
    } catch (e) {
      console.error("Failed to fetch history:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const calculatePlayerRanks = (data: Result[]): PlayerRank[] => {
    const playerRanks: PlayerRank = {};

    data.forEach((doc) => {
      const players = [...doc.players].sort((a, b) => b.score - a.score);

      players.forEach((player, index) => {
        const rank = index + 1;
        if (!playerRanks[player.playerName]) {
          playerRanks[player.playerName] = 0;
        }
        playerRanks[player.playerName] += rank;
      });
    });

    return Object.keys(playerRanks).map((name) => ({
      [name]: playerRanks[name],
    }));
  };

  const calculatePlayerAmounts = (data: Result[]): PlayerRank[] => {
    const playerTotals: PlayerRank = {};

    data.forEach((doc) => {
      doc.players.forEach((player) => {
        if (!playerTotals[player.playerName]) {
          playerTotals[player.playerName] = 0;
        }
        playerTotals[player.playerName] += player.amount || 0;
      });
    });

    return Object.keys(playerTotals).map((name) => ({
      [name]: playerTotals[name],
    }));
  };

  const playerRanks = calculatePlayerRanks(results);
  const playerAmounts = calculatePlayerAmounts(results);
  const hasAmount = results[0]?.players[0]?.amount !== undefined;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <DateDropdownFilter
        uniqueDates={uniqueDates}
        selected={selectedDate}
        setSelected={setSelectedDate}
      />

      <FlatList
        data={results}
        className="flex-1 pt-2 w-full"
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListFooterComponent={
          selectedDate ? (
            <ScrollView className="w-[90vw] mx-auto py-2">
              <Text className="text-white text-xl font-bold text-center mb-2">
                {selectedDate ?? "All Results"}
              </Text>

              <View className="bg-slate-800 p-4 rounded-lg border border-teal-400">
                <Text className="text-white text-lg font-semibold text-center mb-2">
                  {hasAmount ? "Player Amount" : "Player Rankings"}
                </Text>

                {(hasAmount ? playerAmounts : playerRanks)
                  .sort((a, b) => a[Object.keys(a)[0]] - b[Object.keys(b)[0]])
                  .map((entry) =>
                    Object.entries(entry).map(([name, value]) => (
                      <View
                        key={name}
                        className="flex-row justify-between px-2 py-1 border-b border-gray-600"
                      >
                        <Text
                          className="text-white"
                          style={{ fontFamily: "Inter_500Medium" }}
                        >
                          {name}
                        </Text>
                        <Text
                          className="text-white"
                          style={{ fontFamily: "Inter_500Medium" }}
                        >
                          {hasAmount ? value : value * 10}
                        </Text>
                      </View>
                    ))
                  )}
              </View>
            </ScrollView>
          ) : null
        }
        renderItem={({ item }) => <ResultCard result={item} isAdmin={false} />}
        ListEmptyComponent={
          <View className="p-5">
            <Text className="text-white text-center">
              {selectedDate
                ? `No results found for ${selectedDate}`
                : "No results found."}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default HistoryScreen;
