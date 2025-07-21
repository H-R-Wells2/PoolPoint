import { useGameStore } from "@/store/game.store";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

const Settings: React.FC = () => {
  const { totalTableAmount, setTotalTableAmount } = useGameStore();
  const [amount, setAmount] = useState<string>(String(totalTableAmount));

  const handleSave = () => {
    const parsed = parseInt(amount, 10);

    if (isNaN(parsed) || parsed <= 0 || parsed < 10 || parsed > 1000) {
      let errorMessage = "Please enter a valid positive number.";
      if (parsed > 1000) errorMessage = "Amount cannot exceed ₹1000.";
      if (parsed < 10) errorMessage = "Amount cannot be less than ₹10.";

      showMessage({
        message: "Error",
        description: errorMessage,
        type: "danger",
        backgroundColor: "#ef4444",
        color: "white",
      });
      return;
    }

    setTotalTableAmount(parsed);
    showMessage({
      message: "Success",
      description: `Total Table Amount updated to ₹${parsed}`,
      type: "success",
      backgroundColor: "#14b8a6",
      color: "white",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                className="border border-slate-300 rounded-lg px-4 py-3 placeholder:text-slate-500"
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Settings;
