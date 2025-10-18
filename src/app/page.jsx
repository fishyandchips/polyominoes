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
import { Button } from "~/components/ui/button";
import LandscapeIcon from '@mui/icons-material/Landscape';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';

const NUM_ROWS = 11;
const DEFAULT_COLOUR = "#FFFFFF"
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
    color: "#FF0000"
  },
}

export default function Home() {
  const [boardState, setBoardState] = useState(Array.from({ length: NUM_ROWS }, () => {
    return Array.from({ length: NUM_ROWS }, () => ({ features: [], color: DEFAULT_COLOUR }));
  }));
  const [isLandscape, setIsLandscape] = useState(false);
  const [troops, setTroops] = useState([]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateCell = (x, y, colour) => {
   setBoardState((prev) => {
      const newBoard = prev.map((row, rowIndex) => 
          rowIndex === y ? row.map(cell => ({ ...cell })) : row.slice()
      );
      newBoard[y][x] = {
          ...newBoard[y][x],
          color: newBoard[y][x].color === colour ? DEFAULT_COLOUR : colour
      };
      return newBoard;
    });
  }

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
        if (troop.x === x && troop.y === y) {
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
          return { ...troop, x: newX, y: newY, active: false };
        }
        return troop;
      })
    );
  }

  const validTroopPositions = (activeTroop) => {
    return getValidNeighbours(activeTroop.x, activeTroop.y);
  }

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="absolute z-20 bottom-10 right-10 flex flex-col gap-3">
        <Button size="lg" className="cursor-pointer" onClick={generateTerrain}>Generate Terrain</Button>
        <Button size="lg"  className="cursor-pointer" onClick={clearBoard}>Clear Board</Button>
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
                        <div 
                          key={`${troop.x}, ${troop.y}`} 
                          className="absolute w-[75%] h-[75%] flex justify-center items-center rounded-full bg-[#000000]/0 hover:bg-[#000000]/20 transition-all duration-300 ease-in-out" 
                          onClick={(e) => toggleTroopActivity(e, troop.x, troop.y)}
                        >
                          <PersonIcon 
                            style={{ 
                              height: isLandscape ? `calc((100vh/${NUM_ROWS}/2))` : "auto",
                              width: isLandscape ? "auto" : `calc((100vw/${NUM_ROWS}/2))` 
                            }} 
                          />
                        </div>
                      );
                    }
                  })}
                  {activeTroop && validTroopPositions(activeTroop).some((pos) => pos.x === x && pos.y === y) && (
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
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Select 
                  value={currTroop ? currTroop.type : ""} 
                  onValueChange={(value) => {
                    let newTroops = [...troops];
                    if (value === "remove-troop") {
                      newTroops = newTroops.filter((troop) => !(troop.x === x && troop.y === y));
                    } else {
                      newTroops.push({ type: value, x, y, active: false });
                    }
                    setTroops(newTroops);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add troop" />
                  </SelectTrigger>
                  <SelectContent>
                    {currTroop && <SelectItem value={"remove-troop"} className="opacity-50">Remove Troop</SelectItem>}
                    {Object.keys(TROOPS).map((troop, i) => {
                      return (
                        <SelectItem key={i} value={troop}>{troop}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </main>
  );
}
