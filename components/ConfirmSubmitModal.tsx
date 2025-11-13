import React from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ConfirmSubmitModalProps {
  visible: boolean;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmSubmitModal: React.FC<ConfirmSubmitModalProps> = ({
  visible,
  submitting,
  onCancel,
  onConfirm,
}) => (
  <Modal visible={visible} transparent animationType="none">
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white rounded-lg p-6 w-[90vw] max-w-md shadow-lg">
        <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
          Are you sure you want to submit the result?
        </Text>

        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="px-4 py-2.5 bg-gray-300 rounded-md flex-1 mr-2"
            onPress={onCancel}
          >
            <Text className="text-center text-gray-800 font-medium">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-2.5 bg-teal-500 rounded-md flex-1 ml-2"
            disabled={submitting}
            onPress={onConfirm}
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white font-medium">
                Confirm
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default ConfirmSubmitModal;
