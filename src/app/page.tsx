"use client"

import { useState } from "react";
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

  const updateCell = (x, y, colour) => {
    const newBoardState = [...boardState];
    const newBoardRow = [...newBoardState[y]];
    newBoardRow[x] === colour ? newBoardRow[x] = DEFAULT_COLOUR : newBoardRow[x] = colour;
    newBoardState[y] = newBoardRow;
    setBoardState(newBoardState);
  }

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="flex flex-wrap aspect-square h-[95vh]">
        {[...Array(NUM_ROWS * NUM_ROWS)].map((_, i) => {
          const x = i % NUM_ROWS;
          const y = Math.floor(i / NUM_ROWS); 

          return (
            <Popover>
              <PopoverTrigger>
                <div 
                  key={i} 
                  className="aspect-square border border-[#000000] cursor-pointer hover:border-2" 
                  style={{ 
                    height: `calc(95vh/${NUM_ROWS})`,
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
