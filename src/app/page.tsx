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

export default function Home() {
  const [boardState, setBoardState] = useState(Array(NUM_ROWS).fill(Array(NUM_ROWS).fill(DEFAULT_COLOUR)));
  const [isLandscape, setIsLandscape] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateCell = (x, y, colour) => {
    const newBoardState = [...boardState];
    const newBoardRow = [...newBoardState[y]];
    newBoardRow[x] === colour ? newBoardRow[x] = DEFAULT_COLOUR : newBoardRow[x] = colour;
    newBoardState[y] = newBoardRow;
    setBoardState(newBoardState);
  }

  // const generateTerrain = () => {

  // }

  return (
    <main className="w-full h-full flex justify-center items-center">
      {/* <Button className="cursor-pointer" onClick={generateTerrain}>Generate Terrain</Button> */}

      <div 
        className="flex flex-wrap aspect-square"
        style={{ 
          height: isLandscape ? "95vh" : "auto",
          width: isLandscape ? "auto" : "95vw"
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
                    height: isLandscape ? `calc(95vh/${NUM_ROWS})` : "auto",
                    width: isLandscape ? "auto" : `calc(95vw/${NUM_ROWS})`,
                    backgroundColor: boardState[y][x]
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
