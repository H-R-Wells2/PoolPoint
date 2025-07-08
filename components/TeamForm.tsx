import Feather from '@expo/vector-icons/Feather';
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const TeamForm: React.FC = () => {
  const [localTeamNames, setLocalTeamNames] = useState(["Team1", "Team2"]);
  const [localPlayerNames, setLocalPlayerNames] = useState([["Rupesh", "Shubham"], ["Ravi", "Parshya"]]);
  const [editingTeamIndex, setEditingTeamIndex] = useState<number | null>(null);
  const [shuffling, setShuffling] = useState<boolean>(false);

  const handleTeamNameChange = (index: number, value: string) => {
    setLocalTeamNames((prevTeamNames) => {
      const updatedNames = [...prevTeamNames];
      updatedNames[index] = value;
      return updatedNames;
    });
  };

  const handlePlayerNameChange = (teamIndex: number, playerIndex: number, value: string) => {
    setLocalPlayerNames((prevPlayerNames) => {
      const updatedPlayers = [...prevPlayerNames];
      updatedPlayers[teamIndex][playerIndex] = value;
      return updatedPlayers;
    });
  };

  const shufflePlayers = () => {
    const allPlayerNames = [
      ...localPlayerNames[0],
      ...localPlayerNames[1],
    ].filter((name) => name);

    if (allPlayerNames.length < 4) {
      Alert.alert("Error", "Please enter names for all players.");
      return;
    }

    setShuffling(true);

    let shuffleInterval = setInterval(() => {
      const shuffledNames = allPlayerNames.sort(() => Math.random() - 0.5);

      const pairs = [];
      for (let i = 0; i < shuffledNames.length / 2; i++) {
        pairs.push([
          shuffledNames[i],
          shuffledNames[shuffledNames.length - 1 - i],
        ]);
      }

      setLocalPlayerNames([pairs[0], pairs[1]]);
    }, 100);

    setTimeout(() => {
      clearInterval(shuffleInterval);
      const finalShuffledNames = allPlayerNames.sort(() => Math.random() - 0.5);
      const finalPairs = [];
      for (let i = 0; i < finalShuffledNames.length / 2; i++) {
        finalPairs.push([
          finalShuffledNames[i],
          finalShuffledNames[finalShuffledNames.length - 1 - i],
        ]);
      }
      setLocalPlayerNames([finalPairs[0], finalPairs[1]]);
      setShuffling(false);
    }, 2000);
  };

  return (
    <View className="flex justify-center items-center px-4 rounded-lg mx-10 py-6">
      {/* Team 1 */}
      <View className="w-full mb-6">
        {editingTeamIndex === 0 ? (
          <View className="flex-row items-center">
            <TextInput
              value={localTeamNames[0]}
              onChangeText={(text) => handleTeamNameChange(0, text)}
              className="mb-2 p-2.5 text-lg rounded-lg border border-gray-300 w-3/4"
              style={{ color: "white" }} 
            />
            <TouchableOpacity onPress={() => setEditingTeamIndex(null)}>
              <Text className="ml-4 mb-2 text-teal-500 font-semibold text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center mb-5">
            <Text className="text-white mr-2 text-xl font-semibold">{localTeamNames[0]}</Text>
            <TouchableOpacity onPress={() => setEditingTeamIndex(0)}>
              <Text className="text-teal-500"><Feather name="edit" size={20} color="#14b8a6" /></Text>
            </TouchableOpacity>
          </View>
        )}
        {localPlayerNames[0].map((name, index) => (
          <TextInput
            key={`team1-player${index}`}
            value={name}
            onChangeText={(text) => handlePlayerNameChange(0, index, text)}
            placeholder={`Player ${index + 1} of Team 1`}
            className="mb-2 p-2.5 rounded-lg border border-gray-300 w-full"
            style={{ backgroundColor: 'white' }}
          />
        ))}
      </View>

      {/* Team 2 */}
      <View className="w-full mb-6 pt-6 border-t-2 border-slate-200">
        {editingTeamIndex === 1 ? (
          <View className="flex-row items-center ">
            <TextInput
              value={localTeamNames[1]}
              onChangeText={(text) => handleTeamNameChange(1, text)}
              className="mb-2 p-2.5 text-lg rounded-lg border border-gray-300 w-3/4"
              style={{ color: 'white' }}
            />
            <TouchableOpacity onPress={() => setEditingTeamIndex(null)}>
              <Text className="ml-4 mb-2 text-teal-500 font-semibold text-lg">Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center mb-5">
            <Text className="text-white mr-2 text-xl font-semibold">{localTeamNames[1]}</Text>
            <TouchableOpacity onPress={() => setEditingTeamIndex(1)}>
              <Text className="text-teal-500"><Feather name="edit" size={20} color="#14b8a6" /></Text>
            </TouchableOpacity>
          </View>
        )}
        {localPlayerNames[1].map((name, index) => (
          <TextInput
            key={`team2-player${index}`}
            value={name}
            onChangeText={(text) => handlePlayerNameChange(1, index, text)}
            placeholder={`Player ${index + 1} of Team 2`}
            className="mb-2 p-2.5 rounded-lg border border-gray-300 w-full"
            style={{ backgroundColor: 'white' }}
          />
        ))}
      </View>

      {/* Shuffle Button */}
      <TouchableOpacity
        onPress={shufflePlayers}
        disabled={shuffling}
        className={`bg-teal-500 p-2.5 rounded-lg mt-4 w-full ${shuffling ? "opacity-50" : ""}`}
      >
        <Text style={{fontFamily:"Poppins_600SemiBold"}} className="text-white text-lg text-center font-semibold">
          {shuffling ? "Shuffling..." : "Shuffle Players"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`bg-teal-500 p-2.5 rounded-lg mt-4 w-full`}
      >
        <Text style={{fontFamily:"Poppins_600SemiBold"}} className="text-white text-lg text-center font-semibold">
          Start Game
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TeamForm;
