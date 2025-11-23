import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from '~/components/ui/dialog';
import { useScreenOrientation } from "~/hooks/useScreenOrientation";
import { useSkill } from "~/contexts/SkillContext";
import { Handle, Position } from '@xyflow/react';

export const SkillNode = ({ data }) => {
  const [activeUnlock, setActiveUnlock] = useState(null);
  
  const { isUnlocked, canAfford, meetsPrereqs, unlockSkill } = useSkill();
  const skill = data.skill;

  const toggleActiveUnlock = (unlock) => {
    if (!activeUnlock || activeUnlock.name !== unlock.name) {
      setActiveUnlock(unlock);
    } else {
      setActiveUnlock(null);
    }
  }

  const getSkillColor = () => {
    if (isUnlocked(skill)) return "#8FFFA2";
    if (!meetsPrereqs(skill)) return "#888888";
    if (!canAfford(skill)) return "#FF8F8F";
    return "#000000";
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Right}
        id="in"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 invisible"
      />

      <Dialog 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setActiveUnlock(null);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button 
            variant="skill" 
            disabled={!meetsPrereqs(skill)}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 w-30 h-30"
            style={{
              borderColor: getSkillColor(),
              color: getSkillColor(),
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
              disabled={isUnlocked(skill) || !canAfford(skill)}
              onClick={() => unlockSkill(skill)}
              className="w-full cursor-pointer"
            >
              Unlock
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 invisible"
      />
    </div>
  );
};
