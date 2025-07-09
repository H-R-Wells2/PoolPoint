// Optional alternative if you want dropdown instead of native picker
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
  uniqueDates: string[];
  selected: string | null;
  setSelected: (date: string | null) => void;
}

const DateDropdownFilter: React.FC<Props> = ({ uniqueDates, selected, setSelected }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="w-[90vw] mx-auto py-2">
      <TouchableOpacity
        className="bg-slate-800 p-3 rounded-lg border border-teal-300"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center">{selected || "Select a date"}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/70">
          <View className="bg-slate-800 p-4 rounded-lg w-3/4">
            <TouchableOpacity onPress={() => { setSelected(null); setModalVisible(false); }}>
              <Text className="text-red-500 mb-2 text-right">Clear Date</Text>
            </TouchableOpacity>
            <FlatList
              data={uniqueDates}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelected(item);
                    setModalVisible(false);
                  }}
                  className="py-2 border-b border-gray-300"
                >
                  <Text className="text-white">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DateDropdownFilter;
