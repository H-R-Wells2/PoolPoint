import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  players?: string[];
  score: number;
  setScore: (score: number) => void;
}

const PlayerCard = ({ name, players, score, setScore }: Props) => {
  const handleScoreChange = (amount: number) => {
    setScore(score + amount);
  };

  return (
    <View className="bg-slate-800 rounded-xl px-4 py-5 max-w-[90vw] w-full">
      <View className="flex-row justify-between items-center mb-5 border-b border-gray-600 pb-3">
        <View className="flex-1 flex-col mr-2">
          <Text
            className="text-2xl text-white"
            style={{ fontFamily: "Inter_500Medium" }}
          >
            {name}
          </Text>
        </View>
        <View className="flex flex-row gap-2 justify-center items-center mx-2">
          <TouchableOpacity
            onPress={() => handleScoreChange(-1)}
            className="p-1.5 bg-gray-700 rounded-lg"
          >
            <Ionicons name="remove" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-semibold text-center py-1 px-1.5 min-w-12 bg-teal-500 rounded-lg my-2">
            {score}
          </Text>
          <TouchableOpacity
            onPress={() => handleScoreChange(1)}
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

      <View className="flex-row gap-5">
        <View className="flex-1 flex-col">
          <View className="flex-row justify-center gap-2 mb-3">
            {/* Static buttons for negative scores */}
            <TouchableOpacity
              onPress={() => handleScoreChange(-1)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-red-500"
            >
              <Text className="text-white text-center text-lg">-1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(-2)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-500"
            >
              <Text className="text-white text-center text-lg">-2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(-3)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-green-500"
            >
              <Text className="text-white text-center text-lg">-3</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center gap-2 mb-3">
            <TouchableOpacity
              onPress={() => handleScoreChange(-4)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-700"
            >
              <Text className="text-white text-center text-lg">-4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(-5)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-blue-500"
            >
              <Text className="text-white text-center text-lg">-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(-6)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-pink-500"
            >
              <Text className="text-white text-center text-lg">-6</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center gap-2">
            <TouchableOpacity
              onPress={() => handleScoreChange(-7)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-black"
            >
              <Text className="text-white text-center text-lg">-7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(-8)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-orange-500"
            >
              <Text className="text-white text-center text-lg">-8</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 flex-col">
          <View className="flex-row justify-center gap-2 mb-3">
            {/* Static buttons for positive scores */}
            <TouchableOpacity
              onPress={() => handleScoreChange(1)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-red-500"
            >
              <Text className="text-white text-center text-lg">+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(2)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-500"
            >
              <Text className="text-white text-center text-lg">+2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(3)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-green-500"
            >
              <Text className="text-white text-center text-lg">+3</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center gap-2 mb-3">
            <TouchableOpacity
              onPress={() => handleScoreChange(4)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-yellow-700"
            >
              <Text className="text-white text-center text-lg">+4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(5)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-blue-500"
            >
              <Text className="text-white text-center text-lg">+5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(6)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-pink-500"
            >
              <Text className="text-white text-center text-lg">+6</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center gap-2">
            <TouchableOpacity
              onPress={() => handleScoreChange(7)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-black"
            >
              <Text className="text-white text-center text-lg">+7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleScoreChange(8)}
              className="h-11 w-11 rounded-full flex justify-center items-center bg-orange-500"
            >
              <Text className="text-white text-center text-lg">+8</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PlayerCard;
