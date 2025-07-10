import { create } from "zustand";

export type GameState = {
  team1Name: string;
  team1Players: string[];
  team1Score: number;

  team2Name: string;
  team2Players: string[];
  team2Score: number;

  gameStarted: boolean;

  setTeam1Name: (name: string) => void;
  setTeam1Players: (players: string[]) => void;
  setTeam1Score: (score: number) => void;

  setTeam2Name: (name: string) => void;
  setTeam2Players: (players: string[]) => void;
  setTeam2Score: (score: number) => void;

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
  team1Score: 0,

  team2Name: "Team 2",
  team2Players: ["Player 1", "Player 2"],
  team2Score: 0,

  gameStarted: false,

  setTeam1Name: (name) => set({ team1Name: name }),
  setTeam1Players: (players) => set({ team1Players: players }),
  setTeam1Score: (score) => set({ team1Score: score }),

  setTeam2Name: (name) => set({ team2Name: name }),
  setTeam2Players: (players) => set({ team2Players: players }),
  setTeam2Score: (score) => set({ team2Score: score }),

  startGame: () => set({ gameStarted: true }),

  resetGame: () =>
    set({
      team1Name: "Team 1",
      team1Players: ["Shubham", "Parshya"],
      team1Score: 0,
      team2Name: "Team 2",
      team2Players: ["Ravi", "Rupesh"],
      team2Score: 0,
      gameStarted: false,
      playerNames: [],
      playerScores: {},
    }),

  playerNames: [],
  playerScores: {},

  setPlayerNames: (names) => set({ playerNames: names }),
  setPlayerScores: (scores) => set({ playerScores: scores }),
}));
