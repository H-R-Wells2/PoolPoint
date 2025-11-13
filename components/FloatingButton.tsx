import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface FloatingButtonProps {
  onPress: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      position: "absolute",
      bottom: 30,
      right: 25,
      backgroundColor: "#14b8a6",
      borderRadius: 15,
      padding: 13,
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      borderWidth : 1,
      borderColor: "#334155"
    }}
  >
    <Ionicons name="timer-outline" size={26} color="white" />
  </TouchableOpacity>
);

export default FloatingButton;
