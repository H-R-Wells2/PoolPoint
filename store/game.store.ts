import { create } from "zustand";

export type GameState = {
  team1Name: string;
  team1Players: string[];
  team1Scores: number[];
  
  team2Name: string;
  team2Players: string[];
  team2Scores: number[];
  
  gameStarted: boolean;
  teamGameStarted: boolean;
  totalTableAmount: number;
  setTotalTableAmount: (amount: number) => void;
  
  setTeam1Name: (name: string) => void;
  setTeam1Players: (players: string[]) => void;
  setTeam1Scores: (scores: number[]) => void;
  
  setTeam2Name: (name: string) => void;
  setTeam2Players: (players: string[]) => void;
  setTeam2Scores: (scores: number[]) => void;

  startGame: () => void;
  resetGame: () => void;

  playerNames: string[];
  playerScores: { [key: string]: number };

  setPlayerNames: (names: string[]) => void;
  setPlayerScores: (scores: { [key: string]: number }) => void;
};

export const useGameStore = create<GameState>((set) => ({
  team1Name: "Team 1",
  team1Players: ["Player 1", "Player 2"],
  team1Scores: [0,0],
  
  team2Name: "Team 2",
  team2Players: ["Player 1", "Player 2"],
  team2Scores: [0,0],
  setTeam2Scores: (scores) => set({ team2Scores: scores }),
  
  gameStarted: false,
  teamGameStarted: false,
  totalTableAmount: 100,
  setTotalTableAmount: (amount) => set({ totalTableAmount: amount }),
  
  setTeam1Name: (name) => set({ team1Name: name }),
  setTeam1Players: (players) => set({ team1Players: players }),
  setTeam1Scores: (scores) => set({ team1Scores: scores }),

  setTeam2Name: (name) => set({ team2Name: name }),
  setTeam2Players: (players) => set({ team2Players: players }),

  startGame: () =>
    set({
      gameStarted: true,
      teamGameStarted: true,
      team1Name: "Team 1",
      team1Players: ["Shubham", "Parshya"],
      team1Scores: [0, 0],
      team2Name: "Team 2",
      team2Players: ["Ravi", "Rupesh"],
      team2Scores: [0, 0],
      playerNames: [],
      playerScores: {},
    }),

  resetGame: () =>
    set({
      team1Name: "Team 1",
      team1Players: ["Shubham", "Parshya"],
      team1Scores: [0, 0],
      team2Name: "Team 2",
      team2Players: ["Ravi", "Rupesh"],
      team2Scores: [0, 0],
      gameStarted: false,
      teamGameStarted: false,
      playerNames: [],
      playerScores: {},
    }),

  playerNames: [],
  playerScores: {},

  setPlayerNames: (names) => set({ playerNames: names }),
  setPlayerScores: (scores) => set({ playerScores: scores }),
}));
