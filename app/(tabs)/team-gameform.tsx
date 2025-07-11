import { useGameStore } from "@/store/game.store";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TeamFormScreen: React.FC = () => {
  const [localTeamNames, setLocalTeamNames] = useState(["Team 1", "Team 2"]);
  const [localPlayerNames, setLocalPlayerNames] = useState([
    ["Rupesh", "Shubham"],
    ["Ravi", "Parshya"],
  ]);
  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);
  const [shuffling, setShuffling] = useState<boolean>(false);

  const {
    setTeam1Name,
    setTeam1Players,
    setTeam2Name,
    setTeam2Players,
    startGame,
    teamGameStarted,
  } = useGameStore();

  const nextInputRef = useRef<(TextInput | null)[][]>([
    [null, null],
    [null, null],
  ]);

  const handleTeamNameChange = (index: number, value: string) => {
    setLocalTeamNames((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handlePlayerNameChange = (
    teamIndex: number,
    playerIndex: number,
    value: string
  ) => {
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, "");

    setLocalPlayerNames((prev) => {
      const copy = [...prev];
      copy[teamIndex][playerIndex] = cleanedValue;
      return copy;
    });
  };

  const shufflePlayers = () => {
    const allPlayers = [...localPlayerNames[0], ...localPlayerNames[1]].filter(
      Boolean
    );

    if (allPlayers.length < 4) {
      Alert.alert("Error", "Please enter names for all players.");
      return;
    }

    setShuffling(true);

    const interval = setInterval(() => {
      const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
      setLocalPlayerNames([
        [shuffled[0], shuffled[1]],
        [shuffled[2], shuffled[3]],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const final = [...allPlayers].sort(() => Math.random() - 0.5);
      setLocalPlayerNames([
        [final[0], final[1]],
        [final[2], final[3]],
      ]);
      setShuffling(false);
    }, 2000);
  };

  const handleStartGame = () => {
    const allPlayers = [...localPlayerNames[0], ...localPlayerNames[1]];
    const trimmedPlayers = allPlayers.map((name) => name.trim());

    const hasEmpty = trimmedPlayers.some((name) => name === "");
    const hasInvalid = trimmedPlayers.some((name) => name.length < 3);
    const hasDuplicates =
      new Set(trimmedPlayers).size !== trimmedPlayers.length;

    if (hasEmpty) {
      Alert.alert("Missing Name", "All player names must be filled in.");
      return;
    }

    if (hasInvalid) {
      Alert.alert(
        "Invalid Input",
        "Player names must be at least 3 characters long."
      );
      return;
    }

    if (hasDuplicates) {
      Alert.alert("Duplicate Names", "Each player must have a unique name.");
      return;
    }

    const [team1Names, team2Names] = [
      trimmedPlayers.slice(0, 2),
      trimmedPlayers.slice(2, 4),
    ];

    setTeam1Name(localTeamNames[0]);
    setTeam2Name(localTeamNames[1]);
    setTeam1Players(team1Names);
    setTeam2Players(team2Names);
    startGame();
    router.push("/team-gameplay");
  };

  const handleSubmitEditing = (teamIndex: number, playerIndex: number) => {
    if (playerIndex < 1) {
      nextInputRef.current[teamIndex][playerIndex + 1]?.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const handleResume = () => {
    router.push("/team-gameplay");
  };

  return (
    <ScrollView>
      <View className="flex justify-center items-center rounded-lg mx-10 mt-8">
        {[0, 1].map((teamIdx) => (
          <View
            key={teamIdx}
            className={`w-full mb-6 ${teamIdx === 1 ? "pt-6 border-t-2 border-slate-200" : ""}`}
          >
            {editingTeamIndex === teamIdx ? (
              <View className="flex-row items-center">
                <TextInput
                  value={localTeamNames[teamIdx]}
                  onChangeText={(text) => handleTeamNameChange(teamIdx, text)}
                  className="mb-2 p-2.5 text-lg rounded-lg border border-gray-300 w-3/4"
                  style={{ color: "white" }}
                />
                <TouchableOpacity onPress={() => setEditingTeamIndex(null)}>
                  <Text className="ml-4 mb-2 text-teal-500 font-semibold text-lg">
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row items-center mb-5">
                <Text className="text-white mr-2 text-xl font-semibold">
                  {localTeamNames[teamIdx]}
                </Text>
                <TouchableOpacity onPress={() => setEditingTeamIndex(teamIdx)}>
                  <Feather name="edit" size={20} color="#14b8a6" />
                </TouchableOpacity>
              </View>
            )}

            {localPlayerNames[teamIdx].map((name, idx) => (
              <TextInput
                key={`team${teamIdx}-player${idx}`}
                value={name}
                onChangeText={(text) =>
                  handlePlayerNameChange(teamIdx, idx, text)
                }
                placeholder={`Player ${idx + 1} of Team ${teamIdx + 1}`}
                className="mb-2 p-2.5 rounded-lg border border-gray-300 w-full placeholder:text-slate-400"
                style={{
                  backgroundColor: "white",
                  fontFamily: "Inter_500Medium",
                }}
                ref={(el) => {
                  nextInputRef.current[teamIdx][idx] = el;
                }}
                returnKeyType={idx === 1 ? "done" : "next"}
                onSubmitEditing={() => handleSubmitEditing(teamIdx, idx)}
              />
            ))}
          </View>
        ))}

        <TouchableOpacity
          onPress={shufflePlayers}
          disabled={shuffling}
          className={`bg-teal-500 p-2.5 rounded-lg mt-4 w-full ${shuffling ? "opacity-50" : ""}`}
        >
          <Text
            className="text-white text-lg text-center"
            style={{ fontFamily: "Poppins_600SemiBold" }}
          >
            {shuffling ? "Shuffling..." : "Shuffle Players"}
          </Text>
        </TouchableOpacity>

        {teamGameStarted && (
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

export default TeamFormScreen;
