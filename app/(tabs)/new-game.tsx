import { useGameStore } from "@/store/game.store";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NewGameScreen: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(["", "", "", ""]);

  const { setTeam1Players, setTeam2Players, startGame } = useGameStore();

  const nextInputRef = useRef<(TextInput | null)[]>([]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(new Array(count).fill(""));
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    // Allow only alphanumeric input, and no spaces
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, "");
    
    setPlayerNames((prev) => {
      const updatedNames = [...prev];
      updatedNames[index] = cleanedValue;
      return updatedNames;
    });
  };

  const handleStartGame = () => {
    if (playerNames.some((name) => name.length < 3)) {
      Alert.alert("Invalid Input", "Player names must be at least 3 characters long.");
      return;
    }
    setTeam1Players(playerNames.slice(0, playerCount / 2));
    setTeam2Players(playerNames.slice(playerCount / 2, playerCount));
    startGame();
    router.push("/game");
  };

  const renderPlayerInputs = () => {
    return playerNames
      .slice(0, playerCount)
      .map((name, index) => (
        <TextInput
          key={index}
          ref={(el) => { nextInputRef.current[index] = el; }}
          value={name}
          onChangeText={(text) => handlePlayerNameChange(index, text)}
          placeholder={`Player ${index + 1}`}
          className="mb-2 p-2.5 rounded-lg border border-gray-300 w-full"
          style={{ backgroundColor: "white", fontFamily: "Inter_500Medium" }}
          returnKeyType={index === playerCount - 1 ? "done" : "next"}
          onSubmitEditing={() => handleSubmitEditing(index)}
        />
      ));
  };

  const handleSubmitEditing = (index: number) => {
    if (index < playerCount - 1) {
      // Move focus to the next input field
      nextInputRef.current[index + 1]?.focus();
    } else {
      // If it's the last input, start the game or close the keyboard
      handleStartGame();
      Keyboard.dismiss(); // Dismiss the keyboard after the game starts
    }
  };

  return (
    <ScrollView>
      <View className="flex justify-center items-center px-4 rounded-lg mx-10 mt-10">
        <View className="mx-auto w-full flex-1 flex-row mb-5">
          {[2, 3, 4].map((count) => (
            <Pressable
              key={count}
              onPress={() => handlePlayerCountChange(count)}
              className="w-1/3 rounded-lg"
              style={{
                backgroundColor: playerCount === count ? "#14b8a6" : "#111827",
                paddingVertical: 10,
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{ color: "white", fontFamily: "Poppins_600SemiBold" }}
              >
                {" "}
                {count} Players{" "}
              </Text>
            </Pressable>
          ))}
        </View>

        {renderPlayerInputs()}

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

export default NewGameScreen;
