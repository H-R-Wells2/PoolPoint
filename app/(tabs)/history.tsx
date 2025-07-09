/* eslint-disable react-hooks/exhaustive-deps */
import DateCalendarFilter from "@/components/DateDropdownFilter";
import ResultCard from "@/components/ResultCard";
import React, { useCallback, useEffect, useState } from "react";
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

const PAGE_LIMIT = 15;

const HistoryScreen: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUniqueDates = async () => {
    try {
      const resp = await fetch("https://poolpoint-backend.vercel.app/api/unique-dates");
      const json = await resp.json();
      setUniqueDates(json.data || []);
    } catch (e) {
      console.error("Failed to fetch unique dates:", e);
    }
  };

  const fetchHistory = async (reset = false) => {
    if (selectedDate) return;

    if (reset) {
      setPage(1);
      setHasMore(true);
      setResults([]);
    }

    const currentPage = reset ? 1 : page;

    const url = `https://poolpoint-backend.vercel.app/api/results?page=${currentPage}&limit=${PAGE_LIMIT}`;

    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const resp = await fetch(url);
      const json = await resp.json();
      const fetchedResults: Result[] = json.data || [];

      setResults((prev) => {
        if (reset) return fetchedResults;

        const existingIds = new Set(prev.map((item) => item._id));
        const newUnique = fetchedResults.filter((item) => !existingIds.has(item._id));
        return [...prev, ...newUnique];
      });

      const isLastPage = json.totalPages && currentPage >= json.totalPages;
      setHasMore(!isLastPage);

      if (!reset) {
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error("Failed to fetch history:", e);
      if (reset) setResults([]);
    } finally {
      if (reset) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const fetchDateResults = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const resp = await fetch(
        `https://poolpoint-backend.vercel.app/api/dateResults/${selectedDate}`
      );
      const json = await resp.json();
      setResults(json.data || []);
    } catch (e) {
      console.error("Failed to fetch date results:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniqueDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDateResults();
    } else {
      fetchHistory(true);
    }
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

  const handleLoadMore = useCallback(() => {
    if (!selectedDate && !loadingMore && hasMore) {
      fetchHistory();
    }
  }, [selectedDate, loadingMore, hasMore]);

  if (loading && results.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <DateCalendarFilter
        uniqueDates={uniqueDates}
        selected={selectedDate}
        setSelected={setSelectedDate}
      />

      <FlatList
        data={results}
        className="flex-1 pt-2 w-full"
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: selectedDate ? 30 : 60 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <>
            {selectedDate && (
              <ScrollView className="w-[90vw] mx-auto py-2">
                <Text className="text-white text-xl font-bold text-center mb-2">
                  {selectedDate}
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
                          <Text className="text-white">{name}</Text>
                          <Text className="text-white">{hasAmount ? value : value * 10}</Text>
                        </View>
                      ))
                    )}
                </View>
              </ScrollView>
            )}

            {!selectedDate && loadingMore && (
              <View className="py-4 mb-20" style={{ marginBottom: 100 }}>
                <ActivityIndicator size="small" color="#ffffff" />
              </View>
            )}
          </>
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
