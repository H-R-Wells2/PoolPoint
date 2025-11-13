import { useGameStore } from "@/store/game.store";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const TeamActivitySheet = React.forwardRef<BottomSheetModal>((_, ref) => {
  const { teamScoreHistory } = useGameStore();

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["60%", "85%"]}
      enablePanDownToClose
      backdropComponent={({ style }) => (
        <View
          style={[
            style,
            { backgroundColor: "rgba(0,0,0,0.5)", flex: 1 },
          ]}
        />
      )}
      backgroundStyle={{
        backgroundColor: "#111827",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 50 }}
    >
      <BottomSheetView
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 12,
          justifyContent: "flex-start",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#ffffff",
              fontFamily: "Poppins_600SemiBold",
            }}
          >
            🎯 Recent Points
          </Text>

          <TouchableOpacity
            onPress={() => (ref as any)?.current?.dismiss()}
            style={{
              backgroundColor: "#f1f5f9",
              borderRadius: 20,
              padding: 6,
            }}
          >
            <Ionicons name="close" size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Activity List */}
        <ScrollView
          style={{ flex: 1, maxHeight: "85%" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {teamScoreHistory.length === 0 ? (
            <View
              style={{
                paddingVertical: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="time-outline"
                size={36}
                color="#64748b"
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 15,
                  fontFamily: "Poppins_400Regular",
                }}
              >
                Khel to pehle BSDK! 😭
              </Text>
            </View>
          ) : (
            teamScoreHistory
              .slice()
              .reverse()
              .map((log, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#1e293b",
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {/* Player Name */}
                    <Text
                      style={{
                        color: "#f8fafc",
                        fontSize: 16,
                        fontWeight: "600",
                        fontFamily: "Poppins_600SemiBold",
                      }}
                    >
                      {log.playerName}
                    </Text>

                    {/* Team Name */}
                    <Text
                      style={{
                        color: "#38bdf8",
                        fontSize: 13,
                        marginTop: 2,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      {log.teamName}
                    </Text>

                    {/* Timestamp */}
                    <Text
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                        marginTop: 2,
                        fontFamily: "Poppins_400Regular",
                      }}
                    >
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>

                  {/* Points Display */}
                  <Text
                    style={{
                      color:
                        log.pointsChanged > 0 ? "#22c55e" : "#ef4444",
                      fontSize: 18,
                      fontWeight: "700",
                      fontFamily: "Poppins_600SemiBold",
                    }}
                  >
                    {log.pointsChanged > 0 ? "+" : ""}
                    {log.pointsChanged}
                  </Text>
                </View>
              ))
          )}
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TeamActivitySheet.displayName = "TeamActivitySheet";
export default TeamActivitySheet;
