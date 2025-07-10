import { useGameStore } from "@/store/game.store";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const Settings: React.FC = () => {
  const { totalTableAmount, setTotalTableAmount } = useGameStore();
  const [amount, setAmount] = useState<string>(String(totalTableAmount));

  const handleSave = () => {
    const parsed = parseInt(amount, 10);

    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive number.");
      return;
    }

    setTotalTableAmount(parsed);
    Alert.alert("Saved", `Total Table Amount updated to ₹${parsed}`);
  };

  return (
    <View className="flex-1 px-6 my-8">
      <Text
        className="text-2xl mb-4 text-center text-white"
        style={{ fontFamily: "Poppins_600SemiBold" }}
      >
        Settings
      </Text>

      <Text
        className="mb-2 text-gray-300"
        style={{ fontFamily: "Inter_500Medium" }}
      >
        Total Table Amount
      </Text>

      <View className="mb-6 flex gap-3">
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
          className="border border-gray-300 rounded-lg px-4 py-2"
          style={{ backgroundColor: "#fff", fontFamily: "Inter_500Medium" }}
        />

        <TouchableOpacity
          onPress={handleSave}
          className="bg-teal-500 p-3 rounded-lg w-full max-w-[90vw] flex items-center justify-center"
        >
          <Text
            className="text-white text-lg text-center font-semibold"
            style={{ fontFamily: "Poppins_600SemiBold" }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
