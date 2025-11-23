"use client"

import { useState, useCallback } from "react";
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { SkillProvider } from "~/contexts/SkillContext";
import { Button } from "~/components/ui/button";
import { SkillNode } from "~/components/SkillNode"
import { useRouter } from 'next/navigation';
import { SKILLS } from "~/constants/skills";

const nodeTypes = { skillNode: SkillNode };

const RADIUS = 150;

const nodes = SKILLS.map((skill) => {
  const sameTier = SKILLS.filter(s => s.tier === skill.tier);
  const angle = (2 * Math.PI * sameTier.indexOf(skill)) / sameTier.length;

  return {
    id: skill.name,
    type: "skillNode",
    position: {
      x: RADIUS * Math.cos(angle) * skill.tier,
      y: RADIUS * Math.sin(angle) * skill.tier,
    },
    data: { skill },
    draggable: false,
  };
});

const edges = SKILLS.flatMap(skill =>
  skill.prereqs.map(pr => ({
    id: `${pr}-${skill.name}`,
    source: pr,
    target: skill.name,
    type: "straight"
  }))
);


export default function Skills() {
  const router = useRouter();
  const [playerSkills, setPlayerSkills] = useState({
    unlocked: new Set(),
    stars: 0,
  });

  console.log(edges)

  const unlockSkill = useCallback((skill) => {
    setPlayerSkills(prev => ({
      unlocked: new Set([...prev.unlocked, skill.name]),
      stars: prev.stars - skill.cost,
    }));
  }, []);

  const isUnlocked = (skill) => {
    return playerSkills.unlocked.has(skill.name);
  }

  const meetsPrereqs = (skill) => {
    return skill.prereqs.every(req => playerSkills.unlocked.has(req));
  }

  const canAfford = (skill) => {
    return playerSkills.stars >= skill.cost;
  }

  const addStar = () => {
    setPlayerSkills(prev => ({
      ...prev,
      stars: prev.stars + 1
    }));
  }

  const removeStar = () => {
    setPlayerSkills(prev => ({
      ...prev,
      stars: Math.max(0, prev.stars - 1)
    }));
  }

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="absolute z-20 top-5 left-5 flex flex-col gap-3">
        <h1>Stars: {playerSkills.stars}</h1>
        <div className="flex flex-row">
          <Button size="lg" className="cursor-pointer" onClick={addStar}>+</Button>
          <Button size="lg" className="cursor-pointer" onClick={removeStar}>-</Button>
        </div>
      </div>

      <div className="absolute z-20 bottom-5 right-5 flex flex-col gap-3">
        <Button size="lg" className="cursor-pointer" onClick={() => router.push("/")}>&lt; Back to Game</Button>
      </div>

      <SkillProvider
        value={{
          isUnlocked,
          canAfford,
          meetsPrereqs,
          unlockSkill,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          panOnScroll
          fitView
        />
      </SkillProvider>
    </main>
  );
}
