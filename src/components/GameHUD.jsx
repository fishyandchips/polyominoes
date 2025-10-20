import { DEFAULT_TURN_TIME } from "~/constants/meta";
import { TROOPS } from "~/constants/troops";
import { PLAYERS } from "~/constants/players"; 
import { useGame } from "~/contexts/GameContext";
import { formatTime } from "~/utils/timeUtils";
import { Button } from "~/components/ui/button";
import { useRouter } from 'next/navigation';

export function GameHUD() {
  const {
    setTroops,
    currentPlayer,
    setCurrentPlayer,
    setGameStarted,
    turnTimer,
    setTurnTimer,
  } = useGame();
  const router = useRouter();

  const endGame = () => {
    setGameStarted(false);
    setTurnTimer(DEFAULT_TURN_TIME);
    setCurrentPlayer(0);
    setTroops([]);
  }

  const endTurn = () => {
    setTurnTimer(DEFAULT_TURN_TIME);
    setCurrentPlayer(prev => (prev + 1) % PLAYERS.length);
    setTroops(prev => prev.map(troop => ({ ...troop, active: false, numMoves: TROOPS[troop.type].numMoves, numAttacks: TROOPS[troop.type].numAttacks })));
  }

  return (
    <>
      <div className="absolute z-20 top-5 left-5 flex flex-col gap-3">
        <h1 className="font-bold text-xl">{PLAYERS[currentPlayer].username}'s Turn</h1>
        <h2 className="text-lg">{formatTime(turnTimer)}</h2>
      </div>

      <div className="absolute z-20 bottom-5 right-5 flex flex-col gap-3">
        <Button size="lg" className="cursor-pointer" onClick={() => router.push("/skills")}>Skill Tree</Button>
        <Button size="lg" className="cursor-pointer" onClick={endTurn}>End Turn</Button>
        <Button size="lg" className="cursor-pointer" onClick={endGame}>End Game</Button>
      </div>
    </>
  );
}
