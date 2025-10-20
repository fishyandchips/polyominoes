"use client"

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "~/components/ui/dialog"

import { useScreenOrientation } from "~/hooks/useScreenOrientation";
import { useGame } from "~/contexts/GameContext";
import { Button } from "~/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Skills() {
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
  const router = useRouter();
  const [skills, setSkills] = useState([
    { 
      name: "Fishing", 
      unlocked: false, 
      cost: 8, 
      prereqs: [], 
      unlocks: [
        {
          name: "Port",
          description: "Used to convert land units to boats.",
        },
        {
          name: "Fishing Net",
          description: "Unlocks the Fishing Net, which can be placed on Water and Ocean tiles to collect resources the following turn.",
        },
        {
          name: "Movement",
          description: "Allows boats to travel on Water tiles.",
        },
      ], 
    },
    { 
      name: "Seafaring", 
      unlocked: false, 
      cost: 8, 
      prereqs: ["Fishing"],
      unlocks: [
        {
          name: "Advanced Nets",
          description: "Nets now have a 20% chance of catching rare items.",
        },
        {
          name: "Scout",
          description: "Unlocks the Scout troop.",
        },
      ],
    },
    { 
      name: "Fortification", 
      unlocked: false, 
      cost: 8, 
      prereqs: ["Seafaring"],
      unlocks: [
        {
          name: "Harbour Fort",
          description: "Unlocks the Harbour Fort, which can be placed on Ocean tiles to deal damage to opposing troops.",
        },
        {
          name: "Warship",
          description: "Unlocks the Warship troop.",
        },
      ],
    },
    { 
      name: "Aquatism", 
      unlocked: false, 
      cost: 8, 
      prereqs: ["Fortification"],
      unlocks: [
        {
          name: "Leviathan",
          description: "Unlocks the Leviathan troop.",
        },
        {
          name: "Stats Bonus",
          description: "Naval units gain +20% attack damage and +20% defense.",
        },
        {
          name: "Hazard Immunity",
          description: "Naval units are now immune to water hazards, such as whirlpools and storms.",
        },
      ],
    }
  ])
  const [stars, setStars] = useState(0);
  const [activeUnlock, setActiveUnlock] = useState(null);

  const unlockSkill = (skill) => {
    setSkills(prev =>
      prev.map(s => 
        s.name === skill.name ? { ...s, unlocked: true } : s
      )
    );
    setStars(prev => prev - skill.cost);
  }

  const getSkillState = (skill) => {
    if (
      skill.prereqs.length > 0 && 
      !skill.prereqs.some(prereq => skills.find(s => s.name === prereq).unlocked)
    ) return "#000000";

    let color = "#000000";
    if (skill.unlocked) {
      color = "#8FFFA2";
    } else if (stars < skill.cost) {
      color = "#FF8F8F";
    }

    return color;
  };

  const toggleActiveUnlock = (unlock) => {
    if (!activeUnlock || activeUnlock.name !== unlock.name) {
      setActiveUnlock(unlock);
    } else {
      setActiveUnlock(null);
    }
  }

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="absolute z-20 top-5 left-5 flex flex-col gap-3">
        <h1>Stars: {stars}</h1>
        <div className="flex flex-row">
          <Button size="lg" className="cursor-pointer" onClick={() => setStars(prev => prev + 1)}>+</Button>
          <Button size="lg" className="cursor-pointer" onClick={() => setStars(prev => Math.max(0, prev - 1))}>-</Button>
        </div>
      </div>

      <div className="absolute z-20 bottom-5 right-5 flex flex-col gap-3">
        <Button size="lg" className="cursor-pointer" onClick={() => router.push("/")}>&lt; Back to Game</Button>
      </div>

      <div className="flex flex-row gap-4">
        {skills.map((skill, i) => (
          <Dialog 
            key={i}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setActiveUnlock(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button 
                variant="skill" 
                disabled={
                  skill.prereqs.length > 0 && 
                  !skill.prereqs.some(prereq => skills.find(s => s.name === prereq).unlocked)
                }
                className="p-0 cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
                style={{
                  borderColor: getSkillState(skill),
                  color: getSkillState(skill),
                  height: isLandscape ? `calc(100vh/6)` : "auto",
                  width: isLandscape ? "auto" : `calc(100vw/6)`
                }}
              >
                {skill.name}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{skill.name}</DialogTitle>

                <DialogDescription>
                  Unlocking this skill will enable the following:
                </DialogDescription>
              </DialogHeader>

              <div className="w-full flex flex-row justify-evenly">
                {skill.unlocks.map((unlock, i) => (
                  <div key={i} className="flex flex-col justify-center items-center">
                    <Button
                      variant="skill" 
                      className="w-16 h-16 p-0 rounded-full aspect-square cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
                      onClick={() => toggleActiveUnlock(unlock)}
                    />
                    {unlock.name}
                  </div>
                ))}
              </div>
              
              {activeUnlock && (
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold">{activeUnlock.name}</h1>
                  <p>{activeUnlock.description}</p>
                </div>
              )}

              <DialogClose asChild>
                <Button
                  disabled={skill.unlocked || stars < skill.cost}
                  onClick={() => unlockSkill(skill)}
                  className="w-full cursor-pointer"
                >
                  Unlock
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </main>
  );
}
