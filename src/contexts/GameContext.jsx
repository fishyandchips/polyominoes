"use client";

import { createContext, useContext, useState } from "react";
import { NUM_ROWS, DEFAULT_COLOUR } from "~/constants/meta";

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [boardState, setBoardState] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_ROWS }, () => ({ features: [], color: DEFAULT_COLOUR }))
    )
  );
  const [troops, setTroops] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const value = {
    boardState,
    setBoardState,
    troops,
    setTroops,
    currentPlayer,
    setCurrentPlayer,
    gameStarted,
    setGameStarted,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
