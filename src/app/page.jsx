"use client"

import { useState, useEffect } from "react";
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
import { Button } from "~/components/ui/button";
import LandscapeIcon from '@mui/icons-material/Landscape';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';

const NUM_ROWS = 11;
const DEFAULT_COLOUR = "#FFFFFF";
const DEFAULT_TURN_TIME = 60; // 60 seconds -> 1 min
const TERRAIN_COLOURS = {
  Desert: "#FFEE8F",
  Grass: "#8FFFA2",
  Water: "#8FE1FF",
  Ocean: "#7B84DB",
  Snow: "#F0FFFE"
}
const FEATURES = {
  Mountain: {
    color: "#6D6A6A",
    spawnsOn: ["Desert", "Grass", "Snow"], 
    appearance: {
      Desert: <LandscapeIcon className="text-[#6D6A6A]" />,
      Grass: <LandscapeIcon className="text-[#6D6A6A]" />,
      Snow: <LandscapeIcon className="text-[#6D6A6A]" />
    },
    minPerBiome: 2,
    maxPerBiome: 6
  },
  Diamond: {
    color: "#1E6182",
    spawnsOn: ["Desert", "Grass"], 
    appearance: {
      Desert: <DiamondIcon className="text-[#1E6182]" />,
      Grass: <DiamondIcon />,
    },
    minPerBiome: 8,
    maxPerBiome: 12
  },
  Volcano: {
    color: "#F85353",
    spawnsOn: ["Ocean"], 
    appearance: {
      Ocean: <div className="w-[90%] h-[90%] rounded-full border-5 border-[#F85353]" />
    },
    minPerBiome: 1,
    maxPerBiome: 10
  }
}
const TROOPS = {
  Warrior: {
    appearance: (isLandscape) => (
      <PersonIcon
        style={{
          height: isLandscape ? `calc(100vh/${NUM_ROWS}/2)` : "auto",
          width: isLandscape ? "auto" : `calc(100vw/${NUM_ROWS}/2)`
        }}
      />
    ),
    health: 10,
    attack: 5,
    defense: 2,
    movement: 1,
    range: 1,
    numMoves: 1,
    numAttacks: 1
  },
  Rider: {
    appearance: (isLandscape) => (
      <PersonIcon
        className="text-[#FF0000]"
        style={{
          height: isLandscape ? `calc(100vh/${NUM_ROWS}/2)` : "auto",
          width: isLandscape ? "auto" : `calc(100vw/${NUM_ROWS}/2)`
        }}
      />
    ),
    health: 10,
    attack: 5,
    defense: 1,
    movement: 2,
    range: 1,
    numMoves: 2,
    numAttacks: 1
  },
}
const PLAYERS = [
  { username: "Alice" },
  { username: "Bob" },
  { username: "Carl" }
]

export default function Home() {
  const [boardState, setBoardState] = useState(Array.from({ length: NUM_ROWS }, () => {
    return Array.from({ length: NUM_ROWS }, () => ({ features: [], color: DEFAULT_COLOUR }));
  }));
  const [isLandscape, setIsLandscape] = useState(false);
  const [troops, setTroops] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [turnTimer, setTurnTimer] = useState(DEFAULT_TURN_TIME);
  
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setTurnTimer(prev => Math.max(prev - 1, 0));
    }, 1000);

    if (turnTimer === 0) {
      setCurrentPlayer(prev => (prev + 1) % PLAYERS.length);
      setTurnTimer(DEFAULT_TURN_TIME);
      setTroops(prev => prev.map(troop => ({ ...troop, active: false, numMoves: TROOPS[troop.type].numMoves, numAttacks: TROOPS[troop.type].numAttacks })));
    }

    return () => clearInterval(interval);
  }, [gameStarted, turnTimer]);

  // const updateCell = (x, y, colour) => {
  //  setBoardState((prev) => {
  //     const newBoard = prev.map((row, rowIndex) => 
  //         rowIndex === y ? row.map(cell => ({ ...cell })) : row.slice()
  //     );
  //     newBoard[y][x] = {
  //         ...newBoard[y][x],
  //         color: newBoard[y][x].color === colour ? DEFAULT_COLOUR : colour
  //     };
  //     return newBoard;
  //   });
  // }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getValidNeighbours = (x, y) => {
    const validNeighbours = [];
  
    if ((x + 1) < NUM_ROWS) validNeighbours.push({ x: x + 1, y });
    if ((x - 1) >= 0) validNeighbours.push({ x: x - 1, y });
    if ((y + 1) < NUM_ROWS) validNeighbours.push({ x, y: y + 1 });
    if ((y - 1) >= 0) validNeighbours.push({ x, y: y - 1 });
  
    return validNeighbours;
  }
  
  const generateTerrain = () => {
    const newBoard = Array.from({ length: NUM_ROWS }, () => {
      return Array.from({ length: NUM_ROWS }, () => ({ features: [], color: TERRAIN_COLOURS.Ocean }));
    });
  
    const usedSeedCoordinates = new Set();
    const biomes = Object.keys(TERRAIN_COLOURS)
      .filter((terrain) => terrain !== "Water" && terrain !== "Ocean")
      .map((biome) => {
      return { 
        terrain: biome,
        colour: TERRAIN_COLOURS[biome], 
        size: Math.floor(Math.random() * 16) + 30, 
        positions: []
      };
    });
  
    biomes.forEach((biome) => {
      while (biome.positions.length < 1) {
        const x = Math.floor(Math.random() * NUM_ROWS);
        const y = Math.floor(Math.random() * NUM_ROWS);
        const key = `${x}, ${y}`;
  
        if (!usedSeedCoordinates.has(key)) {
          usedSeedCoordinates.add(key);
          newBoard[y][x] = { ...newBoard[y][x], color: biome.colour };
          biome.positions.push({ x, y });
          biome.size--;
        }
      }
    })
  
    while (biomes.some(biome => biome.size > 0)) {
      for (let i = 0; i < biomes.length; i++) {
        const biome = biomes[i];
        if (!biome) continue;
        if (biome.size <= 0) continue;
  
        biome.size--;
        const initPos = biome.positions[Math.floor(Math.random() * biome.positions.length)];
        if (!initPos) continue;
        let validNeighbours = getValidNeighbours(initPos.x, initPos.y);
        validNeighbours = validNeighbours.filter((neighbour) => {
          return newBoard[neighbour.y][neighbour.x].color === TERRAIN_COLOURS.Ocean; 
        });
        const newCell = validNeighbours[Math.floor(Math.random() * validNeighbours.length)];
        if (!newCell) continue;
  
        newBoard[newCell.y][newCell.x] = { ...newBoard[newCell.y][newCell.x], color: biome.colour };
        biome.positions.push({ x: newCell.x, y: newCell.y });
      }
    }

    biomes.push({ 
      terrain: "Water",
      colour: TERRAIN_COLOURS["Water"], 
      size: 0, 
      positions: []
    }, { 
      terrain: "Ocean",
      colour: TERRAIN_COLOURS["Ocean"], 
      size: 0, 
      positions: []
    });
  
    for (let y = 0; y < NUM_ROWS; y++) {
      for (let x = 0; x < NUM_ROWS; x++) {
        if (newBoard[y][x].color === TERRAIN_COLOURS.Ocean) {

          if (getValidNeighbours(x, y)
            .some(
              ({ x, y }) => 
            newBoard[y][x].color !== TERRAIN_COLOURS.Ocean && newBoard[y][x].color !== TERRAIN_COLOURS.Water
          )) {
            newBoard[y][x] = { ...newBoard[y][x], color: TERRAIN_COLOURS.Water };
            const waterBiome = biomes.find(biome => biome.terrain === "Water");
            waterBiome.positions.push({ x, y });
          } else {
            const oceanBiome = biomes.find(biome => biome.terrain === "Ocean");
            oceanBiome.positions.push({ x, y });
          }
        }
      }
    }

    Object.values(FEATURES).forEach((feature) => {
      feature.spawnsOn.forEach((validBiome) => {
        let numFeatures = Math.floor(Math.random() * (feature.maxPerBiome - feature.minPerBiome + 1)) + feature.minPerBiome;

        while (numFeatures > 0) {
          const biome = biomes.find(biome => biome.terrain === validBiome);
          const { x, y } = biome.positions[Math.floor(Math.random() * biome.positions.length)];
          newBoard[y][x] = { ...newBoard[y][x], features: [Object.keys(FEATURES).find(key => FEATURES[key] === feature)] };
          numFeatures--;
        }
      })
    })
  
    setBoardState(newBoard);
  }

  const clearBoard = () => {
    const newBoard = Array.from({ length: NUM_ROWS }, () => 
      Array.from({ length: NUM_ROWS }, () => ({ features: [], color: DEFAULT_COLOUR }))
    );
    setBoardState(newBoard);
    setTroops([]);
  }

  const toggleTroopActivity = (e, x, y) => {
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

  // REFACTOR WITH BFS LATER
  const validTroopPositions = (troop) => {
    const validPositions = [];

    for (let i = 0; i < TROOPS[troop.type].movement; i++) {
      if (validPositions.length === 0) {
        for (let x = troop.x - 1; x <= troop.x + 1; x++) {
          for (let y = troop.y - 1; y <= troop.y + 1; y++) {
            if (
              (validPositions.some((pos) => pos.x === x && pos.y === y)) || // Position already added
              (x === troop.x && y === troop.y) || // Current position
              (x < 0 || x >= NUM_ROWS || y < 0 || y >= NUM_ROWS) || // Out of bounds
              (troops.some((t) => t.x === x && t.y === y)) || // Cell occupied by a troop
              (boardState[y][x].color === TERRAIN_COLOURS["Water"] || boardState[y][x].color === TERRAIN_COLOURS["Ocean"]) || // Water or Ocean Cell
              (boardState[y][x].features.length > 0) // Cell has a feature
            ) continue;
            validPositions.push({ x, y });
          }
        }
      } else {
        validPositions.forEach((pos) => {
          for (let x = pos.x - 1; x <= pos.x + 1; x++) {
            for (let y = pos.y - 1; y <= pos.y + 1; y++) {
              if (
                (validPositions.some((pos) => pos.x === x && pos.y === y)) || // Position already added
                (x === pos.x && y === pos.y) || // Current position
                (x < 0 || x >= NUM_ROWS || y < 0 || y >= NUM_ROWS) || // Out of bounds
                (troops.some((t) => t.x === x && t.y === y)) || // Cell occupied by a troop
                (boardState[y][x].color === TERRAIN_COLOURS["Water"] || boardState[y][x].color === TERRAIN_COLOURS["Ocean"]) || // Water or Ocean Cell
                (boardState[y][x].features.length > 0) // Cell has a feature
              ) continue;
              validPositions.push({ x, y });
            }
          }
        })
      }
    }
  
    return validPositions;
  }

  const startGame = () => {
    setGameStarted(true);
  }

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
    <main className="w-full h-full flex justify-center items-center">
      {gameStarted && (
        <div className="absolute z-20 top-5 left-5 flex flex-col gap-3">
          <h1 className="font-bold text-xl">{PLAYERS[currentPlayer].username}'s Turn</h1>
          <h2 className="text-lg">{formatTime(turnTimer)}</h2>
        </div>
      )}

      <div className="absolute z-20 bottom-5 right-5 flex flex-col gap-3">
        {gameStarted ? (
          <>
            <Button size="lg"  className="cursor-pointer" onClick={endTurn}>End Turn</Button>
            <Button size="lg"  className="cursor-pointer" onClick={endGame}>End Game</Button>
          </>
        ) : (
          <>
            <Button size="lg" className="cursor-pointer" onClick={generateTerrain}>Generate Terrain</Button>
            <Button size="lg"  className="cursor-pointer" onClick={clearBoard}>Clear Board</Button>
            <Button size="lg"  className="cursor-pointer" onClick={startGame}>Start Game</Button>
          </>
        )}
      </div>

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
                  {currFeatures.map((feature) => {
                    return FEATURES[feature].appearance[currTerrain];
                  })}
                  {troops.map((troop) => {
                    if (troop.x === x && troop.y === y) {
                      return (
                        <HoverCard key={`${troop.x}, ${troop.y}`} >
                          <HoverCardTrigger className="relative w-full h-full flex justify-center items-center" >
                            <div 
                              className="absolute w-[75%] h-[75%] flex justify-center items-center rounded-full bg-[#000000]/0 hover:bg-[#000000]/20 transition-all duration-300 ease-in-out" 
                              onClick={(e) => toggleTroopActivity(e, troop.x, troop.y)}
                            >
                              {TROOPS[troop.type].appearance(isLandscape)}
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
                    }
                  })}
                  {activeTroop && activeTroop.numMoves > 0 && validTroopPositions(activeTroop).some((pos) => pos.x === x && pos.y === y) && (
                    <div 
                      className="absolute w-[75%] h-[75%] flex justify-center items-center rounded-full bg-[#000000]/0 hover:bg-[#000000]/20 transition-all duration-300 ease-in-out" 
                      onClick={(e) => moveTroop(e, activeTroop, x, y)}
                    >
                      <div 
                        className="aspect-square opacity-50 bg-[#000000] rounded-full" 
                        style={{ 
                          height: isLandscape ? `calc((100vh/${NUM_ROWS})/6)` : "auto",
                          width: isLandscape ? "auto" : `calc((100vw/${NUM_ROWS})/6)`
                        }} 
                      />
                    </div>  
                  )}
                  {activeTroop && activeTroop.numAttacks > 0 && validAttackPositions(activeTroop).some((pos) => pos.x === x && pos.y === y) && (
                    <div 
                      className="absolute w-[75%] h-[75%] z-10 flex justify-center items-center rounded-full bg-[#000000]/0 hover:bg-[#000000]/20 transition-all duration-300 ease-in-out" 
                      onClick={(e) => attackTroop(e, activeTroop, x, y)}
                    >
                      <div 
                        className="aspect-square opacity-50 bg-[#FF0000] rounded-full" 
                        style={{ 
                          height: isLandscape ? `calc((100vh/${NUM_ROWS})/6)` : "auto",
                          width: isLandscape ? "auto" : `calc((100vw/${NUM_ROWS})/6)`
                        }} 
                      />
                    </div>  
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
