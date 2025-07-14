import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

interface Props {
  uniqueDates: string[];
  selected: string | null;
  setSelected: (date: string | null) => void;
}

const DateCalendarFilter: React.FC<Props> = ({ uniqueDates, selected, setSelected }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const markedDates: Record<string, any> = {};
  uniqueDates.forEach((date) => {
    markedDates[date] = {
      marked: true,
      dotColor: "#14b8a6",
      selected: selected === date,
      selectedColor: "#0f766e",
    };
  });

  if (selected && !markedDates[selected]) {
    markedDates[selected] = {
      selected: true,
      selectedColor: "#0f766e",
    };
  }

  return (
    <View className="w-[90vw] mx-auto py-2">
      <TouchableOpacity
        className="bg-slate-800 p-3 rounded-lg border border-teal-300"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center">
          {selected || "Select a date"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/70">
          <View className="bg-slate-800 p-4 rounded-lg w-[88vw]">
            <Calendar
              markedDates={markedDates}
              onDayPress={(day) => {
                const dateStr = day.dateString;
                setSelected(selected === dateStr ? null : dateStr);
                setModalVisible(false);
              }}
              theme={{
                backgroundColor: "#1e293b",
                calendarBackground: "#1e293b",
                textSectionTitleColor: "#cbd5e1",
                dayTextColor: "#ffffff",
                todayTextColor: "#facc15",
                selectedDayTextColor: "#ffffff",
                monthTextColor: "#14b8a6",
                arrowColor: "#14b8a6",
              }}
            />

            {selected && (
              <TouchableOpacity
                onPress={() => {
                  setSelected(null);
                  setModalVisible(false);
                }}
                className="mt-3 bg-red-600 p-2 rounded"
              >
                <Text className="text-white text-center">Clear Date</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-2 p-2 border border-slate-400 rounded"
            >
              <Text className="text-center text-gray-300">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DateCalendarFilter;
