import { useGameStore } from "@/store/game.store";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

interface Props {
  name: string;
  players?: string[];
  scores: number[];
  setScores: (scores: number[]) => void;
  onPlayerNameChange?: (index: number, newName: string) => void;
  playersAll: string[];
}

const TeamPlayerCard = ({
  name,
  players,
  scores,
  setScores,
  onPlayerNameChange,
  playersAll,
}: Props) => {
  const { addTeamScoreEvent } = useGameStore();

  const handleScoreChange = (index: number, amount: number) => {
    Vibration.vibrate(50);
    const updatedScores = [...scores];
    updatedScores[index] += amount;
    setScores(updatedScores);

    const playerName =
      players && players[index] ? players[index] : `Player ${index + 1}`;

    addTeamScoreEvent(playerName, name, amount);
  };

  const player1name = players && players.length > 0 ? players[0] : "Player 1";
  const player2name = players && players.length > 1 ? players[1] : "Player 2";

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  const isDuplicate = (name: string, index: number) => {
    const cleaned = name.trim().toLowerCase();

    return playersAll.some((n, i) => {
      if (!n) return false;
      return (
        n.trim().toLowerCase() === cleaned &&
        !(players?.[index].toLowerCase() === cleaned)
      );
    });
  };

  const generateUniqueName = (baseName: string) => {
    let cleaned = baseName.trim();
    let finalName = cleaned;
    let counter = 1;

    while (
      playersAll
        .map((n) => n.toLowerCase().trim())
        .includes(finalName.toLowerCase())
    ) {
      finalName = `${cleaned}${counter}`;
      counter++;
    }

    return finalName;
  };

  return (
    <View className="w-full bg-slate-800 rounded-xl border border-gray-900 overflow-hidden pb-3">
      <View className="flex flex-row justify-between items-center w-full px-3 bg-slate-700 py-2">
        <Text
          className="text-white text-2xl font-semibold"
        >
          {name}
        </Text>
        <Text
          className="text-white text-2xl w-1/3 text-center border border-teal-500 p-1 bg-slate-800 rounded-lg"
          style={{ fontFamily: "Inter_500Medium" }}
        >
          {scores[0] + scores[1]}
        </Text>
      </View>

      {/* Team 1 */}
      {[player1name, player2name].map((player, index) => (
        <View key={index} className="px-3 pb-2 pt-2 w-full">
          <View className="flex-row justify-between items-center pb-1.5">
            <View className="flex-1 flex-row items-center gap-2">
              {editingIndex === index ? (
                <>
                  <TextInput
                    className="text-xl text-white font-normal border-b border-teal-500"
                    style={{
                      fontFamily: "Inter_500Medium",
                      paddingVertical: 0,
                      lineHeight: 35,
                    }}
                    value={editedName}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^A-Za-z0-9]/g, "");
                      setEditedName(cleaned);
                    }}
                    autoFocus
                    onBlur={() => {
                      let finalName = editedName.trim();

                      if (finalName.length === 0) {
                        finalName = `Player${index + 1}`;
                      }

                      if (isDuplicate(finalName, index)) {
                        showMessage({
                          message: "Duplicate name",
                          description:
                            "This name already exists, so we adjusted it.",
                          type: "danger",
                          backgroundColor: "#ef4444",
                          color: "white",
                        });

                        finalName = generateUniqueName(finalName);
                      }

                      onPlayerNameChange?.(index, finalName);
                      setEditingIndex(null);
                    }}
                    onSubmitEditing={() => {
                      let finalName = editedName.trim();

                      // 1️⃣ If blank → fallback
                      if (finalName.length === 0) {
                        finalName = `Player ${index + 1}`;
                      }

                      // 2️⃣ If duplicate → auto-correct
                      if (isDuplicate(finalName, index)) {
                        showMessage({
                          message: "Duplicate name",
                          description:
                            "This name already exists, so we adjusted it.",
                          type: "danger",
                          backgroundColor: "#ef4444",
                          color: "white",
                        });

                        finalName = generateUniqueName(finalName);
                      }

                      onPlayerNameChange?.(index, finalName);
                      setEditingIndex(null);
                    }}
                    returnKeyType="done"
                  />
                  {editingIndex === index && isDuplicate(editedName, index) && (
                    <Text className="text-red-400 mt-1 text-sm">
                      This name already exists
                    </Text>
                  )}
                </>
              ) : (
                <Text
                  className="text-xl text-white"
                  style={{ fontFamily: "Inter_500Medium" }}
                >
                  {player}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => {
                  setEditingIndex(index);
                  setEditedName(player);
                }}
              >
                <Feather name="edit" size={20} color="#14b8a6" />
              </TouchableOpacity>
            </View>
            <View className="flex flex-row gap-2 justify-center items-center mx-2">
              <TouchableOpacity
                onPress={() => handleScoreChange(index, -1)}
                className="p-1.5 bg-gray-700 rounded-lg"
              >
                <Ionicons name="remove" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-semibold text-center py-1 px-1.5 min-w-12 bg-teal-500 rounded-lg my-2">
                {scores[index]}
              </Text>
              <TouchableOpacity
                onPress={() => handleScoreChange(index, 1)}
                className="p-1.5 bg-gray-700 rounded-lg"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => setScore(0)}
                className="p-1.5 bg-gray-700 rounded-lg"
              >
                <Ionicons name="reload" size={24} color="white" />
              </TouchableOpacity> */}
            </View>
          </View>

          <View className="flex-row gap-5 border border-teal-700 rounded-xl py-5">
            <View className="flex-1 flex-col">
              <View className="flex-row justify-center gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -1)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-red-500"
                >
                  <Text className="text-white text-center text-lg">-1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -2)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-500"
                >
                  <Text className="text-white text-center text-lg">-2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -3)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-green-500"
                >
                  <Text className="text-white text-center text-lg">-3</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -4)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-700"
                >
                  <Text className="text-white text-center text-lg">-4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -5)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-blue-500"
                >
                  <Text className="text-white text-center text-lg">-5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -6)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-pink-500"
                >
                  <Text className="text-white text-center text-lg">-6</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center gap-2">
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -7)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-black"
                >
                  <Text className="text-white text-center text-lg">-7</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, -8)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-orange-500"
                >
                  <Text className="text-white text-center text-lg">-8</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-1 flex-col">
              <View className="flex-row justify-center gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 1)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-red-500"
                >
                  <Text className="text-white text-center text-lg">+1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 2)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-500"
                >
                  <Text className="text-white text-center text-lg">+2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 3)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-green-500"
                >
                  <Text className="text-white text-center text-lg">+3</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 4)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-700"
                >
                  <Text className="text-white text-center text-lg">+4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 5)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-blue-500"
                >
                  <Text className="text-white text-center text-lg">+5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 6)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-pink-500"
                >
                  <Text className="text-white text-center text-lg">+6</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center gap-2">
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 7)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-black"
                >
                  <Text className="text-white text-center text-lg">+7</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleScoreChange(index, 8)}
                  className="h-11 w-11 rounded-full flex justify-center items-center bg-orange-500"
                >
                  <Text className="text-white text-center text-lg">+8</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default TeamPlayerCard;
