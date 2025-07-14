import { useGameStore } from "@/store/game.store";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GameFormScreen: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);

  const {
    setPlayerNames: setStoreNames,
    setPlayerScores,
    gameStarted,
    startGame,
    isLP,
    setIsLP
  } = useGameStore();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(""));
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "");
    setPlayerNames((prev) => {
      const updated = [...prev];
      updated[index] = cleaned;
      return updated;
    });
  };

  const handleSubmitEditing = (index: number) => {
    if (index < playerCount - 1) {
      inputRefs.current[index + 1]?.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const handleStartGame = () => {
    const trimmedNames = playerNames.slice(0, playerCount);

    const hasEmpty = trimmedNames.some((name) => name.trim() === "");
    const hasInvalid = trimmedNames.some((name) => name.trim().length < 3);
    const hasDuplicates =
      new Set(trimmedNames.map((name) => name.trim())).size !==
      trimmedNames.length;

    if (hasEmpty) {
      Alert.alert("Missing Name", "All player names must be filled in.");
      return;
    }

    if (hasDuplicates) {
      Alert.alert("Duplicate Names", "Each player must have a unique name.");
      return;
    }

    if (hasInvalid) {
      Alert.alert(
        "Invalid Input",
        "Player names must be at least 3 characters long."
      );
      return;
    }

    const scores: { [key: string]: number } = {};
    trimmedNames.forEach((name) => (scores[name.trim()] = 0));

    setStoreNames(trimmedNames.map((name) => name.trim()));
    setPlayerScores(scores);
    startGame();

    router.push("/gameplay");
  };

  const handleResume = () => {
    router.push("/gameplay");
  };

  return (
    <ScrollView>
      <Pressable onPress={()=>setIsLP(!isLP)} className="flex-row items-center justify-start gap-2 w-[85vw] mx-auto mt-4 mb-1">
        <Text
          style={{
            color: "white",
            fontFamily: "Poppins_600SemiBold",
            fontSize: 16,
          }}
        >
          Looser-Pays
          {isLP ? " Enabled" : " Disabled"}
        </Text>
        <Switch
          value={isLP}
          onValueChange={()=>setIsLP(!isLP)}
          thumbColor={isLP ? "#14b8a6" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#0f766e" }}
        />
      </Pressable>
      <View className="flex justify-center items-center rounded-lg w-[85vw] mx-auto">
        <View className="mx-auto w-full flex-1 flex-row mb-5 justify-between">
          {[2, 3, 4].map((count) => (
            <Pressable
              key={count}
              onPress={() => handlePlayerCountChange(count)}
              className="w-[32%] rounded-lg"
              style={{
                backgroundColor: playerCount === count ? "#14b8a6" : "#1f2937",
                paddingVertical: 10,
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Poppins_600SemiBold",
                  textAlign: "center",
                }}
              >
                {count} Players
              </Text>
            </Pressable>
          ))}
        </View>

        {playerNames.slice(0, playerCount).map((name, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={name}
            onChangeText={(text) => handlePlayerNameChange(index, text)}
            placeholder={`Player ${index + 1}`}
            className="mb-2 p-2.5 rounded-lg border border-slate-400 w-full placeholder:text-slate-500"
            style={{
              backgroundColor: "#1e293b",
              color: "white",
              fontFamily: "Inter_500Medium",
            }}
            returnKeyType={index === playerCount - 1 ? "done" : "next"}
            onSubmitEditing={() => handleSubmitEditing(index)}
          />
        ))}

        {gameStarted && (
          <TouchableOpacity
            onPress={handleResume}
            className="bg-teal-500 p-2.5 rounded-lg mt-4 w-full"
          >
            <Text
              className="text-white text-lg text-center"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Resume Game
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleStartGame}
          className="bg-teal-500 p-2.5 rounded-lg mt-4 w-full"
        >
          <Text
            className="text-white text-lg text-center"
            style={{ fontFamily: "Poppins_600SemiBold" }}
          >
            Start Game
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GameFormScreen;
