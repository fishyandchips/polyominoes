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

const NUM_ROWS = 11;
const DEFAULT_COLOUR = "#FFFFFF"
const TERRAIN_COLOURS = {
  Desert: "#FFEE8F",
  Grass: "#8FFFA2",
  Water: "#8FE1FF",
  Ocean: "#7B84DB",
  Snow: "#F0FFFE"
}

type Coords = { x: number, y: number };

export default function Home() {
  const [boardState, setBoardState] = useState(Array.from({ length: NUM_ROWS }, () => {
    return Array(NUM_ROWS).fill(DEFAULT_COLOUR);
  }));
  const [isLandscape, setIsLandscape] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateCell = (x: number, y: number, colour: string) => {
   setBoardState((prev) => {
      const newBoard = prev.map((row) => [...row]);
      newBoard[y]![x] = newBoard[y]![x] === colour ? DEFAULT_COLOUR : colour;
      return newBoard;
    });
  }

  const getValidNeighbours = (x: number, y: number) => {
    const validNeighbours = [];

    if ((x + 1) < NUM_ROWS) validNeighbours.push({ x: x + 1, y });
    if ((x - 1) >= 0) validNeighbours.push({ x: x - 1, y });
    if ((y + 1) < NUM_ROWS) validNeighbours.push({ x, y: y + 1 });
    if ((y - 1) >= 0) validNeighbours.push({ x, y: y - 1 });

    return validNeighbours;
  }

  const generateTerrain = () => {
    const newBoard = Array.from({ length: NUM_ROWS }, () => {
      return Array(NUM_ROWS).fill(TERRAIN_COLOURS.Ocean);
    });

    const usedSeedCoordinates = new Set();
    const biomes = Object.keys(TERRAIN_COLOURS)
      .filter((terrain) => terrain !== "Water" && terrain !== "Ocean")
      .map((biome) => {
      return { 
        colour: TERRAIN_COLOURS[biome as keyof typeof TERRAIN_COLOURS], 
        size: Math.floor(Math.random() * 16) + 30, 
        positions: [] as Coords[]
      };
    });

    biomes.forEach((biome) => {
      while (biome.positions.length < 1) {
        const x = Math.floor(Math.random() * NUM_ROWS);
        const y = Math.floor(Math.random() * NUM_ROWS);
        const key = `${x}, ${y}`;

        if (!usedSeedCoordinates.has(key)) {
          usedSeedCoordinates.add(key);
          newBoard[y]![x] = biome.colour;
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
          return newBoard[neighbour.y]![neighbour.x] === TERRAIN_COLOURS.Ocean; 
        });
        const newCell = validNeighbours[Math.floor(Math.random() * validNeighbours.length)];
        if (!newCell) continue;

        newBoard[newCell.y]![newCell.x] = biome.colour;
        biome.positions.push({ x: newCell.x, y: newCell.y });
      }
    }

    for (let y = 0; y < NUM_ROWS; y++) {
      for (let x = 0; x < NUM_ROWS; x++) {
        if (newBoard[y]![x] === TERRAIN_COLOURS.Ocean && 
          getValidNeighbours(x, y)
            .some(
              ({ x, y }) => 
            newBoard[y]![x] !== TERRAIN_COLOURS.Ocean && newBoard[y]![x] !== TERRAIN_COLOURS.Water
        )) {
          newBoard[y]![x] = TERRAIN_COLOURS.Water;
        }
      }
    }

    setBoardState(newBoard);
  }

  const clearBoard = () => {
    const newBoard = Array.from({ length: NUM_ROWS }, () => 
        Array(NUM_ROWS).fill(DEFAULT_COLOUR)
    );
    setBoardState(newBoard);
  }

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="absolute bottom-10 right-10 flex flex-col gap-3">
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
          const currColor = boardState[y]![x];
          const currTerrain = Object.keys(TERRAIN_COLOURS).find(
            key => TERRAIN_COLOURS[key as keyof typeof TERRAIN_COLOURS] === currColor
          ) || "empty";

          return (
            <Popover key={i}>
              <PopoverTrigger>
                <div
                  className="aspect-square border border-[#000000] cursor-pointer hover:border-2" 
                  style={{ 
                    height: isLandscape ? `calc(100vh/${NUM_ROWS})` : "auto",
                    width: isLandscape ? "auto" : `calc(100vw/${NUM_ROWS})`,
                    backgroundColor: currColor
                  }} 
                />
              </PopoverTrigger>
              <PopoverContent>
                <Select 
                  value={currTerrain} 
                  onValueChange={(terrain) => {
                    const newColor = TERRAIN_COLOURS[terrain as keyof typeof TERRAIN_COLOURS] || DEFAULT_COLOUR;
                    updateCell(x, y, newColor);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Terrain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty" className="opacity-50">Empty</SelectItem>
                    {Object.keys(TERRAIN_COLOURS).map((terrain, i) => {
                      return (
                        <SelectItem key={i} value={terrain}>{terrain}</SelectItem>
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
