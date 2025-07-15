import { useGameStore } from "@/store/game.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { todaySummary, lastGame, setTodaySummary, setLastGame } =
    useGameStore();

  const [fetching, setFetching] = useState(true);

  const pages = [
    { href: "/gameform", title: "New Game" },
    { href: "/team-gameform", title: "Team Game" },
    { href: "/history", title: "History" },
    { href: "/settings", title: "Settings" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, lastGameRes] = await Promise.all([
          fetch("https://poolpoint-backend.vercel.app/api/today-summary"),
          fetch("https://poolpoint-backend.vercel.app/api/last-game"),
        ]);

        const summaryJson = await summaryRes.json();
        const lastGameJson = await lastGameRes.json();

        setTodaySummary(summaryJson);
        setLastGame(lastGameJson);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePress = (href: any) => router.push(href);

  return (
    <ScrollView
      className=""
      contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
    >
      <View className="flex-1 w-[90vw] mx-auto">
        {/* Header Image */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/images/snooker1.jpg")}
            className="w-[90vw] h-[21vh] rounded-2xl mt-4"
          />
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row flex-wrap justify-between mt-8">
          {pages.map((item) => (
            <TouchableOpacity
              key={item.href}
              onPress={() => handlePress(item.href)}
              className="bg-teal-500 px-4 py-2.5 rounded-lg my-2"
              style={{ width: "48%" }}
            >
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-lg text-white text-center"
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Motivational Quote */}
        <View className="rounded-xl px-4 py-3 border border-gray-700 mt-6">
          <Text className="text-gray-400 italic text-center">
            &quot;Precision beats power. Timing beats speed.&quot;
          </Text>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-6 w-[90vw]">
          <View className="flex-1 h-[1px] bg-gray-700" />
          <Text className="text-gray-400 mx-3 text-xs uppercase tracking-widest">
            Your Activity
          </Text>
          <View className="flex-1 h-[1px] bg-gray-700" />
        </View>

        {/* Today’s Summary */}
        {todaySummary ? (
          <View className="bg-slate-800 rounded-xl px-4 py-5 w-[90vw] mt-2">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">
                Today’s Summary
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons
                name="game-controller-outline"
                size={18}
                color="#38bdf8"
              />
              <Text className="text-gray-300 ml-2">
                Games Played: {todaySummary.gamesPlayed}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="cash-outline" size={18} color="#34d399" />
              <Text className="text-gray-300 ml-2">
                Total Paid: ₹{todaySummary.totalPaid}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="trophy-outline" size={18} color="#facc15" />
              <Text className="text-gray-300 ml-2">
                Top Player: {todaySummary.topPlayer}
              </Text>
            </View>
          </View>
        ) : fetching ? (
          <View className="flex-1 items-center justify-center mt-4 bg-slate-800 w-[90vw] h-36 rounded-xl">
            <ActivityIndicator size="large" color="#22d3ee" />
          </View>
        ) : null}

        {/* Last Game */}
        {lastGame ? (
          <View className="bg-slate-800 rounded-xl px-4 py-5 w-[90vw] mt-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="play-outline" size={20} color="#ffffff" />
              <Text className="text-white font-semibold text-lg ml-2">
                Last Game
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="people-outline" size={18} color="#38bdf8" />
              <Text className="text-gray-300 ml-2">
                {lastGame.game.players
                  .map((p) => `${p.playerName} ${p.score}`)
                  .join(", ")}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#10b981"
              />
              <Text className="text-gray-300 ml-2">
                Winner:{" "}
                {Array.isArray(lastGame.winner)
                  ? lastGame.winner.join(" & ")
                  : lastGame.winner}
              </Text>
            </View>
            <TouchableOpacity
              className="mt-3 w-1/2"
              onPress={() => router.push("/history")}
            >
              <Text className="text-teal-400 font-semibold">
                View Details →
              </Text>
            </TouchableOpacity>
          </View>
        ) : fetching ? (
          <View className="flex-1 items-center justify-center mt-4 bg-slate-800 w-[90vw] h-36 rounded-xl">
            <ActivityIndicator size="large" color="#22d3ee" />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
