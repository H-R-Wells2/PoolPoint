import { useGameStore } from "@/store/game.store";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ActivitySheet = React.forwardRef<BottomSheetModal>((_, ref) => {
  const { scoreHistory } = useGameStore();

  const latestLogs = scoreHistory.slice(-12).reverse();

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["40%", "70%"]}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={({ style }) => (
        <View
          style={[style, { backgroundColor: "rgba(0,0,0,0.45)", flex: 1 }]}
        />
      )}
      backgroundStyle={{
        backgroundColor: "#111827",
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#64748b",
        width: 60,
        height: 5,
        borderRadius: 4,
      }}
    >
      <BottomSheetView
        style={{
          flex: 1,
          paddingHorizontal: 18,
          paddingTop: 10,
          paddingBottom: 6,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="stats-chart-outline" size={22} color="#38bdf8" />

            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#f8fafc",
                letterSpacing: 0.3,
              }}
            >
              Recent Points
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => (ref as any)?.current?.dismiss()}
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 50,
              padding: 6,
            }}
          >
            <Ionicons name="close" size={20} color="#e2e8f0" />
          </TouchableOpacity>
        </View>

        {/* GRID */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            columnGap: "3.5%",
            rowGap: 12
          }}
        >
          {latestLogs.length === 0 ? (
            <View
              style={{
                paddingVertical: 70,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Ionicons
                name="time-outline"
                size={28}
                color="#64748b"
                style={{ marginBottom: 8 }}
              />
              <Text style={{ color: "#94a3b8", fontSize: 15 }}>
                Pehle khel to sahi bhosdike!
              </Text>
            </View>
          ) : (
            latestLogs.map((log, index) => (
              <BlurView
                key={index}
                intensity={20}
                tint="dark"
                style={{
                  width: "31%",
                  borderRadius: 14,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderWidth: 0,
                  borderColor: "#1e293b",
                  backgroundColor: "#1e293b",
                }}
              >
                {/* Name */}
                <Text
                  style={{
                    color: "#f8fafc",
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {log.playerName}
                </Text>

                {/* Timestamp */}
                <Text
                  style={{
                    color: "#94a3b8",
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>

                {/* Points */}
                <View
                  style={{
                    marginTop: 6,
                    backgroundColor:
                      log.pointsChanged > 0
                        ? "rgba(34,197,94,0.25)"
                        : "rgba(239,68,68,0.25)",
                    paddingVertical: 3,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: log.pointsChanged > 0 ? "#4ade80" : "#f87171",
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {log.pointsChanged > 0 ? "+" : ""}
                    {log.pointsChanged}
                  </Text>
                </View>
              </BlurView>
            ))
          )}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ActivitySheet.displayName = "ActivitySheet";
export default ActivitySheet;
