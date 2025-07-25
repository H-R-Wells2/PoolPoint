import { useGameStore } from "@/store/game.store";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { showMessage } from "react-native-flash-message";

const GameFormScreen: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(4).fill(""));

  const {
    setPlayerNames: setStoreNames,
    setPlayerScores,
    gameStarted,
    startGame,
    isLP,
    setIsLP,
  } = useGameStore();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames((prev) => {
      const updated = [...prev];
      while (updated.length < count) updated.push("");
      return updated.slice(0, count);
    });
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
      showMessage({
        message: "Missing Name",
        description: "All player names must be filled in.",
        type: "danger",
        backgroundColor: "#ef4444",
        color: "white",
      });
      return;
    }

    if (hasDuplicates) {
      showMessage({
        message: "Duplicate Names",
        description: "Each player must have a unique name.",
        type: "danger",
        backgroundColor: "#ef4444",
        color: "white",
      });
      return;
    }

    if (hasInvalid) {
      showMessage({
        message: "Invalid Input",
        description: "Player names must be at least 3 characters long.",
        type: "danger",
        backgroundColor: "#ef4444",
        color: "white",
      });
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View className="w-[85vw] mx-auto">
            <Pressable
              onPress={() => {
                if (playerCount === 2) {
                  setIsLP(!isLP);
                }
              }}
              className="flex-row items-center justify-start gap-1 mt-4 mb-1 w-1/2"
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Poppins_600SemiBold",
                  fontSize: 16,
                }}
              >
                Loser-Pays
              </Text>
              <Switch
                value={isLP}
                onValueChange={() => setIsLP(!isLP)}
                thumbColor={isLP ? "#14b8a6" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#0f766e" }}
              />
            </Pressable>

            <View className="flex justify-center items-center">
              <View className="mx-auto w-full flex-1 flex-row mb-5 justify-between">
                {[2, 3, 4].map((count) => (
                  <Pressable
                    key={count}
                    onPress={() => handlePlayerCountChange(count)}
                    className="w-[32%] rounded-lg"
                    style={{
                      backgroundColor:
                        playerCount === count ? "#14b8a6" : "#1f2937",
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
                  className="mb-2 p-2.5 rounded-lg border border-slate-300 w-full placeholder:text-slate-500"
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
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default GameFormScreen;
