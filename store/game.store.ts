import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */
export type GameState = {
  /* ---------- Team Game ---------- */
  team1Name: string;
  team1Players: string[];
  team1Scores: number[];
  team2Name: string;
  team2Players: string[];
  team2Scores: number[];
  teamGameStarted: boolean;
  teamTimerSeconds: number;
  teamTimerInterval: number | null;

  /* ---------- Normal Game ---------- */
  gameStarted: boolean;
  playerNames: string[];
  playerScores: { [key: string]: number };
  totalTableAmount: number;
  gameTimerSeconds: number;
  gameTimerInterval: number | null;
  isLP: boolean;
  isTeamLP: boolean;

  /* ---------- Dashboard Data ---------- */
  todaySummary: {
    gamesPlayed: number;
    totalPaid: number;
    topPlayer: string;
  } | null;

  lastGame: {
    game: {
      _id: string;
      players: { playerName: string; score: number }[];
    };
    winner: string;
  } | null;

  /* ---------- Score History ---------- */
  scoreHistory: {
    playerName: string;
    pointsChanged: number; // positive or negative
    timestamp: string; // ISO time
  }[];

  addScoreEvent: (playerName: string, pointsChanged: number) => void;
  clearScoreHistory: () => void;

  /* ---------- Team Game Score History ---------- */
  teamScoreHistory: {
    playerName: string;
    teamName: string;
    pointsChanged: number;
    timestamp: string;
  }[];
  addTeamScoreEvent: (
    playerName: string,
    teamName: string,
    pointsChanged: number
  ) => void;
  clearTeamScoreHistory: () => void;

  /* ---------- Setters ---------- */
  setTotalTableAmount: (amount: number) => void;
  setTeam1Name: (name: string) => void;
  setTeam1Players: (players: string[]) => void;
  setTeam1Scores: (scores: number[]) => void;
  setTeam2Name: (name: string) => void;
  setTeam2Players: (players: string[]) => void;
  setTeam2Scores: (scores: number[]) => void;
  setPlayerNames: (names: string[]) => void;
  setPlayerScores: (scores: { [key: string]: number }) => void;
  setIsLP: (value: boolean) => void;
  setIsTeamLP: (value: boolean) => void;
  toggleLP: () => void;

  setTodaySummary: (summary: GameState["todaySummary"]) => void;
  setLastGame: (game: GameState["lastGame"]) => void;

  /* ---------- Game control ---------- */
  startGame: () => void;
  resetGame: () => void;

  startTeamGame: () => void;
  resetTeamGame: () => void;

  /* ---------- Timer ---------- */
  startGameTimer: () => void;
  stopGameTimer: () => void;
  resetGameTimer: () => void;

  startTeamTimer: () => void;
  stopTeamTimer: () => void;
  resetTeamTimer: () => void;

  /* ---------- History ---------- */
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
};

/* ------------------------------------------------------------------ */
/* Store */
/* ------------------------------------------------------------------ */
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      /* ----- Initial game state ----- */
      team1Name: "Team 1",
      team1Players: ["Player 1", "Player 2"],
      team1Scores: [0, 0],
      team2Name: "Team 2",
      team2Players: ["Player 1", "Player 2"],
      team2Scores: [0, 0],
      teamGameStarted: false,
      teamTimerSeconds: 0,
      teamTimerInterval: null,

      gameStarted: false,
      totalTableAmount: 100,
      playerNames: [],
      playerScores: {},
      gameTimerSeconds: 0,
      gameTimerInterval: null,
      isLP: false,
      isTeamLP: false,

      /* ----- Dashboard state ----- */
      todaySummary: null,
      lastGame: null,

      /* ----- Score History ----- */
      scoreHistory: [],

      addScoreEvent: (playerName, pointsChanged) =>
        set((state) => ({
          scoreHistory: [
            ...state.scoreHistory,
            {
              playerName,
              pointsChanged,
              timestamp: new Date().toISOString(),
            },
          ],
        })),

      clearScoreHistory: () => set({ scoreHistory: [] }),

      /* ---------- Team Score History ---------- */
      teamScoreHistory: [],
      addTeamScoreEvent: (playerName, teamName, pointsChanged) =>
        set((state) => ({
          teamScoreHistory: [
            ...state.teamScoreHistory,
            {
              playerName,
              teamName,
              pointsChanged,
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      clearTeamScoreHistory: () => set({ teamScoreHistory: [] }),

      /* ----- History ----- */
      selectedDate: null,
      setSelectedDate: (date) => set({ selectedDate: date }),

      /* ----- Setters ----- */
      setTotalTableAmount: (amount) => set({ totalTableAmount: amount }),
      setTeam1Name: (name) => set({ team1Name: name }),
      setTeam1Players: (players) => set({ team1Players: players }),
      setTeam1Scores: (scores) => set({ team1Scores: scores }),
      setTeam2Name: (name) => set({ team2Name: name }),
      setTeam2Players: (players) => set({ team2Players: players }),
      setTeam2Scores: (scores) => set({ team2Scores: scores }),
      setPlayerNames: (names) => set({ playerNames: names }),
      setPlayerScores: (scores) => set({ playerScores: scores }),
      setIsLP: (value) => set({ isLP: value }),
      setIsTeamLP: (value) => set({ isTeamLP: value }),
      toggleLP: () => set((state) => ({ isLP: !state.isLP })),

      setTodaySummary: (summary) => set({ todaySummary: summary }),
      setLastGame: (game) => set({ lastGame: game }),

      /* ----- Game logic ----- */
      startGame: () => {
        get().resetGameTimer();
        const interval = setInterval(() => {
          set((state) => ({ gameTimerSeconds: state.gameTimerSeconds + 1 }));
        }, 1000);
        set({
          gameStarted: true,
          playerScores: {},
          gameTimerSeconds: 0,
          gameTimerInterval: interval as unknown as number,
        });
      },

      resetGame: () => {
        const interval = get().gameTimerInterval;
        if (interval) clearInterval(interval);
        set({
          gameStarted: false,
          playerNames: [],
          playerScores: {},
          gameTimerSeconds: 0,
          gameTimerInterval: null,
        });
        set({ scoreHistory: [] });
      },

      startTeamGame: () => {
        get().resetTeamTimer();
        const interval = setInterval(() => {
          set((state) => ({ teamTimerSeconds: state.teamTimerSeconds + 1 }));
        }, 1000);
        set({
          teamGameStarted: true,
          team1Name: "Team 1",
          team1Scores: [0, 0],
          team2Name: "Team 2",
          team2Scores: [0, 0],
          teamTimerSeconds: 0,
          teamTimerInterval: interval as unknown as number,
        });
      },

      resetTeamGame: () => {
        const interval = get().teamTimerInterval;
        if (interval) clearInterval(interval);
        set({
          teamGameStarted: false,
          team1Name: "Team 1",
          team1Players: ["Shubham", "Parshya"],
          team1Scores: [0, 0],
          team2Name: "Team 2",
          team2Players: ["Ravi", "Rupesh"],
          team2Scores: [0, 0],
          teamTimerSeconds: 0,
          teamTimerInterval: null,
        });
        set({ teamScoreHistory: [] });
      },

      /* ----- Timers ----- */
      startGameTimer: () => {
        if (get().gameTimerInterval !== null) return;
        const interval = setInterval(() => {
          set((state) => ({ gameTimerSeconds: state.gameTimerSeconds + 1 }));
        }, 1000);
        set({ gameTimerInterval: interval as unknown as number });
      },

      stopGameTimer: () => {
        const interval = get().gameTimerInterval;
        if (interval) {
          clearInterval(interval);
          set({ gameTimerInterval: null });
        }
      },

      resetGameTimer: () => {
        const interval = get().gameTimerInterval;
        if (interval) clearInterval(interval);
        set({ gameTimerSeconds: 0, gameTimerInterval: null });
      },

      startTeamTimer: () => {
        if (get().teamTimerInterval !== null) return;
        const interval = setInterval(() => {
          set((state) => ({ teamTimerSeconds: state.teamTimerSeconds + 1 }));
        }, 1000);
        set({ teamTimerInterval: interval as unknown as number });
      },

      stopTeamTimer: () => {
        const interval = get().teamTimerInterval;
        if (interval) {
          clearInterval(interval);
          set({ teamTimerInterval: null });
        }
      },

      resetTeamTimer: () => {
        const interval = get().teamTimerInterval;
        if (interval) clearInterval(interval);
        set({ teamTimerSeconds: 0, teamTimerInterval: null });
      },
    }),
    {
      name: "game-storage", // key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),

      /* Persist Storage */
      partialize: (state: GameState) => ({
        totalTableAmount: state.totalTableAmount,
        isLP: state.isLP,
        isTeamLP: state.isTeamLP,
      }),
    }
  )
);
