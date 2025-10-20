"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { NUM_ROWS, DEFAULT_COLOUR, DEFAULT_TURN_TIME } from "~/constants/meta";
import { PLAYERS } from "~/constants/players";
import { TROOPS } from "~/constants/troops";
import { useRouter } from 'next/navigation';

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
  const [turnTimer, setTurnTimer] = useState(DEFAULT_TURN_TIME);
  const router = useRouter();

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setTurnTimer(prev => Math.max(prev - 1, 0));
    }, 1000);

    if (turnTimer === 0) {
      setCurrentPlayer(prev => (prev + 1) % PLAYERS.length);
      setTurnTimer(DEFAULT_TURN_TIME);
      setTroops(prev => prev.map(troop => ({ ...troop, active: false, numMoves: TROOPS[troop.type].numMoves, numAttacks: TROOPS[troop.type].numAttacks })));
      // router.push("/");
    }

    return () => clearInterval(interval);
  }, [gameStarted, turnTimer]);

  const value = {
    boardState,
    setBoardState,
    troops,
    setTroops,
    currentPlayer,
    setCurrentPlayer,
    gameStarted,
    setGameStarted,
    turnTimer,
    setTurnTimer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
