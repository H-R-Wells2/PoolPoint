import PlayerCard from "@/components/PlayerCard";
import TeamForm from "@/components/TeamForm";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TeamGame = () => {
  // State for team 1
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team1Players, setTeam1Players] = useState(["Player 1", "Player 2"]);
  const [team1Score, setTeam1Score] = useState(0);

  // State for team 2
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [team2Players, setTeam2Players] = useState(["Player 1", "Player 2"]);
  const [team2Score, setTeam2Score] = useState(0);

  return (
    <ScrollView>
      <SafeAreaView className="flex-1">
        <TeamForm />

        <View className="flex flex-col justify-center items-center w-full">
          {/* PlayerCard for Team 1 */}
          <PlayerCard
            name={team1Name}
            players={team1Players}
            score={team1Score}
            setScore={setTeam1Score}
          />
          
          <PlayerCard
            name={team2Name}
            players={team2Players}
            score={team2Score}
            setScore={setTeam2Score}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default TeamGame;
