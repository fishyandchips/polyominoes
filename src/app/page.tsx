"use client"

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
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
        size: Math.floor(Math.random() * 6) + 20, 
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
          newBoard[x]![y] = biome.colour;
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

        const initPos = biome.positions[Math.floor(Math.random() * biome.positions.length)];
        if (!initPos) continue;
        let validNeighbours = getValidNeighbours(initPos.x, initPos.y);
        validNeighbours = validNeighbours.filter((neighbour) => {
          return newBoard[neighbour.x]![neighbour.y] === TERRAIN_COLOURS.Ocean; 
        })
        const newCell = validNeighbours[Math.floor(Math.random() * validNeighbours.length)];
        if (!newCell) continue;

        newBoard[newCell.x]![newCell.y] = biome.colour;
        biome.positions.push({ x: newCell.x, y: newCell.y });
        biome.size--;
      }
    }

    setBoardState(newBoard);
  }

  const clearBoard = () => {
    const newBoard = Array(NUM_ROWS).fill(Array(NUM_ROWS).fill(DEFAULT_COLOUR));
    setBoardState(newBoard);
  }

  return (
    <main className="w-full h-full flex justify-center items-center">
      <Button className="cursor-pointer" onClick={generateTerrain}>Generate Terrain</Button>
      <Button className="cursor-pointer" onClick={clearBoard}>Clear Board</Button>

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

          return (
            <Popover key={i}>
              <PopoverTrigger>
                <div
                  className="aspect-square border border-[#000000] cursor-pointer hover:border-2" 
                  style={{ 
                    height: isLandscape ? `calc(100vh/${NUM_ROWS})` : "auto",
                    width: isLandscape ? "auto" : `calc(100vw/${NUM_ROWS})`,
                    backgroundColor: boardState[y]![x]
                  }} 
                />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col w-32 gap-4">
                <Button className="cursor-pointer" onClick={() => updateCell(x, y, "#FFFF00")}>Desert</Button>
                <Button className="cursor-pointer" onClick={() => updateCell(x, y, "#0000FF")}>Water</Button>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </main>
  );
}
