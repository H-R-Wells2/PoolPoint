import { useGameStore } from "@/store/game.store";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
    <ScrollView>
      <View className="flex-1 py-8 w-[85vw] mx-auto">
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
            className="border border-slate-400 rounded-lg px-4 py-3"
            style={{
              backgroundColor: "#1e293b",
              color: "white",
              fontFamily: "Inter_500Medium",
            }}
          />
          <TouchableOpacity
            onPress={handleSave}
            className="bg-teal-500 p-2.5 rounded-lg w-full"
          >
            <Text
              className="text-white text-lg text-center"
              style={{ fontFamily: "Poppins_600SemiBold" }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
