import { useGameStore } from "@/store/game.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

interface TimerProps {
  isActive: boolean;
  mode: "game" | "team";
}

const Timer = ({ isActive, mode }: TimerProps) => {
  const {
    gameTimerSeconds,
    teamTimerSeconds,
    startGameTimer,
    stopGameTimer,
    startTeamTimer,
    stopTeamTimer,
  } = useGameStore();

  useEffect(() => {
    if (isActive) {
      if (mode === "team") {
        startTeamTimer();
      } else {
        startGameTimer();
      }
    } else {
      if (mode === "team") {
        stopTeamTimer();
      } else {
        stopGameTimer();
      }
    }

    return () => {
      if (mode === "team") {
        stopTeamTimer();
      } else {
        stopGameTimer();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, mode]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const seconds = mode === "team" ? teamTimerSeconds : gameTimerSeconds;

  return (
    <View className="flex flex-row min-w-[26vw] justify-between items-center py-2 px-4 -mb-1.5 bg-slate-800 rounded-xl">
      <Ionicons
        name="time-outline"
        size={22}
        color="#14b8a6"
        className="mr-1"
      />
      <Text className="text-white text-xl text-center tabular-nums font-semibold">
        {formatTime(seconds)}
      </Text>
    </View>
  );
};

export default Timer;
