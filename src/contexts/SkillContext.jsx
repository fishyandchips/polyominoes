"use client";

import { createContext, useContext } from "react";

const SkillContext = createContext();

export function useSkill() {
  return useContext(SkillContext);
}

export function SkillProvider({ children, value }) {
  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
}
