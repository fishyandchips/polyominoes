"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"

import { NUM_ROWS } from "~/constants/meta";
import { TERRAIN_COLOURS } from "~/constants/terrain";
import { FEATURES } from "~/constants/features";
import { TROOPS } from "~/constants/troops";

import { useScreenOrientation } from "~/hooks/useScreenOrientation";
import { useGame } from "~/contexts/GameContext";

import { GameHUD } from "~/components/GameHUD";
import { SetupHUD } from "~/components/SetupHUD";

export default function Home() {
  const { isLandscape } = useScreenOrientation();
  const { 
    boardState, 
    setBoardState, 
    troops,
    setTroops,
    currentPlayer,
    setCurrentPlayer,
    gameStarted,
    setGameStarted
  } = useGame();

  const toggleTroop = (e, x, y) => {
    e.stopPropagation();
    setTroops(prev =>
      prev.map(troop => {
        if (troop.x === x && troop.y === y && currentPlayer === troop.player && (troop.numMoves > 0 || troop.numAttacks > 0)) {
          return { ...troop, active: !troop.active };
        }
        return { ...troop, active: false };
      })
    );
  }

  const moveTroop = (e, activeTroop, newX, newY) => {
    e.stopPropagation();
    setTroops(prev =>
      prev.map(troop => {
        if (troop.x === activeTroop.x && troop.y === activeTroop.y) {
          return { ...troop, x: newX, y: newY, active: false, numMoves: troop.numMoves - 1 };
        }
        return troop;
      })
    );
  }

  const attackTroop = (e, activeTroop, newX, newY) => {
    e.stopPropagation();
    const attackedTroop = troops.find((troop) => troop.x === newX && troop.y === newY);

    setTroops(prev => {
      if ((TROOPS[activeTroop.type].attack - TROOPS[attackedTroop.type].defense) >= attackedTroop.health) { // Troop is killed off
        return prev
          .filter(troop => !(troop.x === newX && troop.y === newY))
          .map(troop => {
            if (troop.x === activeTroop.x && troop.y === activeTroop.y) {
              return { ...troop, x: newX, y: newY, active: false, numMoves: troop.numMoves - 1, numAttacks: troop.numAttacks - 1 };
            }
            return troop;
        })
      } else {
        return prev.map(troop => {
          if (troop.x === activeTroop.x && troop.y === activeTroop.y) {
            return { ...troop, active: false, health: troop.health - (TROOPS[attackedTroop.type].attack - TROOPS[troop.type].defense), numMoves: troop.numMoves - 1, numAttacks: troop.numAttacks - 1 };
          } else if (troop.x === attackedTroop.x && troop.y === attackedTroop.y) {
            return { ...troop, active: false, health: troop.health - (TROOPS[activeTroop.type].attack - TROOPS[troop.type].defense) };
          }
          return troop;
        });
      }
    });
  }

  const validAttackPositions = (troop) => {
    const validPositions = [];

    for (let x = troop.x - TROOPS[troop.type].range; x <= troop.x + TROOPS[troop.type].range; x++) {
      for (let y = troop.y - TROOPS[troop.type].range; y <= troop.y + TROOPS[troop.type].range; y++) {
        if (
          (x < 0 || x >= NUM_ROWS || y < 0 || y >= NUM_ROWS) || // Out of bounds
          (x === troop.x && y === troop.y) || // Current position
          (!troops.some((t) => t.x === x && t.y === y)) || // Cell unoccupied by a troop
          (troops.some((t) => t.x === x && t.y === y && t.player === currentPlayer)) // The troop is one of the player's troops
        ) continue;
        validPositions.push({ x, y });
      }
    }
  
    return validPositions;
  }

  const validTroopPositions = (troop) => {
    const maxMove = TROOPS[troop.type].movement;
    const results = [];
    const visited = new Set();

    const key = (x, y) => `${x},${y}`;

    const isBlocked = (x, y) =>
      x < 0 || x >= NUM_ROWS ||
      y < 0 || y >= NUM_ROWS ||
      troops.some(t => t.x === x && t.y === y) ||
      boardState[y][x].color === TERRAIN_COLOURS["Water"] ||
      boardState[y][x].color === TERRAIN_COLOURS["Ocean"] ||
      boardState[y][x].features.length > 0;

    const queue = [{ x: troop.x, y: troop.y, dist: 0 }];
    visited.add(key(troop.x, troop.y));

    while (queue.length > 0) {
      const { x, y, dist } = queue.shift();

      if (dist === maxMove) continue;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;

          const nx = x + dx;
          const ny = y + dy;
          const k = key(nx, ny);

          if (visited.has(k) || isBlocked(nx, ny)) continue;

          visited.add(k);
          results.push({ x: nx, y: ny });
          queue.push({ x: nx, y: ny, dist: dist + 1 });
        }
      }
    }

    return results;
  };

  // const validTroopPositions = (troop) => {
  //   const validPositions = [];

  //   for (let i = 0; i < TROOPS[troop.type].movement; i++) {
  //     if (validPositions.length === 0) {
  //       for (let x = troop.x - 1; x <= troop.x + 1; x++) {
  //         for (let y = troop.y - 1; y <= troop.y + 1; y++) {
  //           if (
  //             (validPositions.some((pos) => pos.x === x && pos.y === y)) || // Position already added
  //             (x === troop.x && y === troop.y) || // Current position
  //             (x < 0 || x >= NUM_ROWS || y < 0 || y >= NUM_ROWS) || // Out of bounds
  //             (troops.some((t) => t.x === x && t.y === y)) || // Cell occupied by a troop
  //             (boardState[y][x].color === TERRAIN_COLOURS["Water"] || boardState[y][x].color === TERRAIN_COLOURS["Ocean"]) || // Water or Ocean Cell
  //             (boardState[y][x].features.length > 0) // Cell has a feature
  //           ) continue;
  //           validPositions.push({ x, y });
  //         }
  //       }
  //     } else {
  //       validPositions.forEach((pos) => {
  //         for (let x = pos.x - 1; x <= pos.x + 1; x++) {
  //           for (let y = pos.y - 1; y <= pos.y + 1; y++) {
  //             if (
  //               (validPositions.some((pos) => pos.x === x && pos.y === y)) || // Position already added
  //               (x === pos.x && y === pos.y) || // Current position
  //               (x < 0 || x >= NUM_ROWS || y < 0 || y >= NUM_ROWS) || // Out of bounds
  //               (troops.some((t) => t.x === x && t.y === y)) || // Cell occupied by a troop
  //               (boardState[y][x].color === TERRAIN_COLOURS["Water"] || boardState[y][x].color === TERRAIN_COLOURS["Ocean"]) || // Water or Ocean Cell
  //               (boardState[y][x].features.length > 0) // Cell has a feature
  //             ) continue;
  //             validPositions.push({ x, y });
  //           }
  //         }
  //       })
  //     }
  //   }
  
  //   return validPositions;
  // }

  const TroopHoverCard = ({ troop }) => (
    <HoverCard key={`${troop.x}, ${troop.y}`} >
      <HoverCardTrigger className="relative w-full h-full flex justify-center items-center" >
        <div 
          className="absolute w-[75%] h-[75%] flex justify-center items-center rounded-full bg-[#000000]/0 hover:bg-[#000000]/20 transition-all duration-300 ease-in-out" 
          onClick={(e) => toggleTroop(e, troop.x, troop.y)}
        >
          {TROOPS[troop.type].appearance}
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <h1 className="font-bold">{troop.type}</h1>
        {Object.keys(troop).map((field) => (
          <p>{field}: {String(troop[field])}</p>
        ))}
      </HoverCardContent>
    </HoverCard>
  );

  const MoveIndicator = ({ troop, x, y }) => (
    <div 
      className="absolute w-[75%] h-[75%] flex justify-center items-center rounded-full bg-[#000000]/0 hover:bg-[#000000]/20 transition-all duration-300 ease-in-out" 
      onClick={(e) => moveTroop(e, troop, x, y)}
    >
      <div 
        className="aspect-square opacity-50 bg-[#000000] rounded-full" 
        style={{ 
          height: isLandscape ? `calc((100vh/${NUM_ROWS})/6)` : "auto",
          width: isLandscape ? "auto" : `calc((100vw/${NUM_ROWS})/6)`
        }} 
      />
    </div>
  );

  const AttackIndicator = ({ troop, x, y }) => (
    <div 
      className="absolute w-[75%] h-[75%] z-10 flex justify-center items-center rounded-full bg-[#000000]/0 hover:bg-[#000000]/20 transition-all duration-300 ease-in-out" 
      onClick={(e) => attackTroop(e, troop, x, y)}
    >
      <div 
        className="aspect-square opacity-50 bg-[#FF0000] rounded-full" 
        style={{ 
          height: isLandscape ? `calc((100vh/${NUM_ROWS})/6)` : "auto",
          width: isLandscape ? "auto" : `calc((100vw/${NUM_ROWS})/6)`
        }} 
      />
    </div>
  );

  return (
    <main className="w-full h-full flex justify-center items-center">
      {gameStarted ? (
        <GameHUD />
      ) : (
        <SetupHUD />
      )}

      <div 
        className="flex flex-wrap aspect-square"
        style={{ 
          height: isLandscape ? "100vh" : "auto",
          width: isLandscape ? "auto" : "100vw"
        }}
      >
        {[...Array(NUM_ROWS * NUM_ROWS)].map((_, i) => {
          const x = i % NUM_ROWS;
          const y = Math.floor(i / NUM_ROWS); 
          const currColor = boardState[y][x].color;
          const currFeatures = boardState[y][x].features;
          const currTerrain = Object.keys(TERRAIN_COLOURS).find(
            key => TERRAIN_COLOURS[key] === currColor
          );
          const currTroop = troops.find((troop) => troop.x === x && troop.y === y);
          const activeTroop = troops.find((troop) => troop.active);

          return (
            <Popover key={i}>
              <PopoverTrigger>
                <div
                  className="relative aspect-square border border-[#000000] cursor-pointer hover:border-2 flex justify-center items-center" 
                  style={{ 
                    height: isLandscape ? `calc(100vh/${NUM_ROWS})` : "auto",
                    width: isLandscape ? "auto" : `calc(100vw/${NUM_ROWS})`,
                    backgroundColor: currColor
                  }} 
                >
                  {currFeatures.map((feature, i) => (
                    <div key={i} className="w-full h-full flex justify-center items-center">
                      {FEATURES[feature].appearance[currTerrain]}
                    </div>
                  ))}
                  {currTroop && (
                    <TroopHoverCard troop={currTroop} />
                  )}
                  {activeTroop && activeTroop.numMoves > 0 && validTroopPositions(activeTroop).some((pos) => pos.x === x && pos.y === y) && (
                    <MoveIndicator troop={activeTroop} x={x} y={y} />
                  )}
                  {activeTroop && activeTroop.numAttacks > 0 && validAttackPositions(activeTroop).some((pos) => pos.x === x && pos.y === y) && (
                    <AttackIndicator troop={activeTroop} x={x} y={y} />
                  )}
                </div>
              </PopoverTrigger>
              {gameStarted && (!currTroop || currTroop.player === currentPlayer) && (
                <PopoverContent>
                  <Select
                    value={currTroop ? currTroop.type : ""}
                    onValueChange={(value) => {
                      let newTroops = troops.filter((troop) => !(troop.x === x && troop.y === y));
                      if (value !== "remove-troop") {
                        newTroops.push({ type: value, x, y, active: false, player: currentPlayer, health: TROOPS[value].health, numMoves: TROOPS[value].numMoves, numAttacks: TROOPS[value].numAttacks });
                      }
                      setTroops(newTroops);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Add troop" />
                    </SelectTrigger>
                    <SelectContent>
                      {currTroop && (
                        <SelectItem value="remove-troop" className="opacity-50">
                          Remove Troop
                        </SelectItem>
                      )}
                      {Object.keys(TROOPS).map((troop) => (
                        <SelectItem key={troop} value={troop}>
                          {troop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </PopoverContent>
              )}
            </Popover>
          );
        })}
      </div>
    </main>
  );
}
