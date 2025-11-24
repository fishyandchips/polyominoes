export const SKILLS = [
  { 
    name: "Navigation", 
    tier: 1,
    cost: 8, 
    prereqs: [], 
    appearance: <></>,
    unlocks: [
      {
        name: "Movement",
        description: "Allows troops to travel on all terrain.",
        appearance: <></>
      },
    ], 
  },
  { 
    name: "Fishing", 
    tier: 2,
    cost: 8, 
    prereqs: ["Navigation"], 
    appearance: <></>,
    unlocks: [
      {
        name: "Port",
        description: "Used to convert land units to boats.",
        appearance: <></>
      },
      {
        name: "Fishing Net",
        description: "Unlocks the Fishing Net, which can be placed on Water and Ocean tiles to collect resources the following turn.",
        appearance: <></>
      },
    ], 
  },
  { 
    name: "Seafaring", 
    tier: 3,
    cost: 8, 
    prereqs: ["Fishing"],
    appearance: <></>,
    unlocks: [
      {
        name: "Advanced Nets",
        description: "Nets now have a 20% chance of catching rare items.",
        appearance: <></>
      },
      {
        name: "Warship",
        description: "Unlocks the Warship troop.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Aquatism", 
    tier: 4,
    cost: 8, 
    prereqs: ["Seafaring"],
    appearance: <></>,
    unlocks: [
      {
        name: "Leviathan",
        description: "Unlocks the Leviathan troop.",
        appearance: <></>
      },
      {
        name: "Stats Bonus",
        description: "Naval units gain +20% attack damage and +20% defense.",
        appearance: <></>
      },
      {
        name: "Hazard Immunity",
        description: "Naval units are now immune to water hazards, such as whirlpools and storms.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Roads", 
    tier: 2,
    cost: 8, 
    prereqs: ["Navigation"],
    appearance: <></>,
    unlocks: [
      {
        name: "Roads",
        description: "Can be used for faster navigation.",
        appearance: <></>
      },
      {
        name: "Bridges",
        description: "Allows land units to travel over water.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Vision", 
    tier: 3,
    cost: 8, 
    prereqs: ["Roads"],
    appearance: <></>,
    unlocks: [
      {
        name: "Shortcuts",
        description: "Faster paths for navigating through terrain.",
        appearance: <></>
      },
      {
        name: "Visibility Bonus",
        description: "Troop vision radius increased by 1.",
        appearance: <></>
      },
      {
        name: "Generator Locations",
        description: "Diamond and Emerald generator locations revealed.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Worldview", 
    tier: 4,
    cost: 8, 
    prereqs: ["Vision"],
    appearance: <></>,
    unlocks: [
      {
        name: "Scout",
        description: "Unlocks the Scout troop.",
        appearance: <></>
      },
      {
        name: "Global Vision",
        description: "All tiles now revealed.",
        appearance: <></>
      },
      {
        name: "Road Speed Bonus",
        description: "Troops now travel at 2x speed on Roads and Bridges.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Mining", 
    tier: 1,
    cost: 8, 
    prereqs: [],
    appearance: <></>,
    unlocks: [
      {
        name: "Mines",
        description: "Produces 2 population.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Metallurgy", 
    tier: 2,
    cost: 8, 
    prereqs: ["Mining"],
    appearance: <></>,
    unlocks: [
      {
        name: "Forge",
        description: "Produces 2 population for every adjacent Mine.",
        appearance: <></>
      },
      {
        name: "Weapon Attacks Bonus",
        description: "Weapon users gain +10% attack damage.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Siege", 
    tier: 3,
    cost: 8, 
    prereqs: ["Metallurgy"],
    appearance: <></>,
    unlocks: [
      {
        name: "Bomber",
        description: "Unlocks the Bomber troop.",
        appearance: <></>
      },
      {
        name: "Faster Mines",
        description: "Mines now produce +3 stars every iteration and have a chance of uncovering rare ores.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Fortress", 
    tier: 4,
    cost: 8, 
    prereqs: ["Siege"],
    appearance: <></>,
    unlocks: [
      {
        name: "Golem",
        description: "Unlocks the Golem troop.",
        appearance: <></>
      },
      {
        name: "Walls",
        description: "Can be placed on territory borders.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Archery", 
    tier: 2,
    cost: 8, 
    prereqs: ["Mining"],
    appearance: <></>,
    unlocks: [
      {
        name: "Archer",
        description: "Unlocks the Archer troop.",
        appearance: <></>
      },
      {
        name: "Ranged Attacks Bonus",
        description: "Ranged units gain +10% attack damage.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Martial", 
    tier: 3,
    cost: 8, 
    prereqs: ["Archery"],
    appearance: <></>,
    unlocks: [
      {
        name: "Swordsman",
        description: "Unlocks the Swordsman troop.",
        appearance: <></>
      },
      {
        name: "Melee Attacks Bonus",
        description: "Melee units gain +10% attack damage.",
        appearance: <></>
      },
      {
        name: "Defense Bonus",
        description: "All troops gain +10% defense.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Vanguard", 
    tier: 4,
    cost: 8, 
    prereqs: ["Martial"],
    appearance: <></>,
    unlocks: [
      {
        name: "Sniper",
        description: "Unlocks the Sniper troop.",
        appearance: <></>
      },
      {
        name: "Dragonslayer",
        description: "Unlocks the Dragonslayer troop.",
        appearance: <></>
      },
      {
        name: "Critical Attack Rate",
        description: "All troops gain +20% critical attack rate.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Organisation", 
    tier: 1,
    cost: 8, 
    prereqs: [],
    appearance: <></>,
    unlocks: [
      {
        name: "Fruits",
        description: "Produces 1 population.",
        appearance: <></>
      },
      {
        name: "Hunting",
        description: "Produces 1 population.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Cultivation", 
    tier: 2,
    cost: 8, 
    prereqs: ["Organisation"],
    appearance: <></>,
    unlocks: [
      {
        name: "Farming",
        description: "Produces 2 population.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Harvest", 
    tier: 3,
    cost: 8, 
    prereqs: ["Cultivation"],
    appearance: <></>,
    unlocks: [
      {
        name: "Windmill",
        description: "Produces 1 population for every adjacent Farm.",
        appearance: <></>
      },
      {
        name: "Burn Forest",
        description: "Turns a Forest into a Field.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Prosperity", 
    tier: 4,
    cost: 8, 
    prereqs: ["Harvest"],
    appearance: <></>,
    unlocks: [
      {
        name: "Trade",
        description: "Number of stars generated increases by 1 for each Windmill and Forge and their levels.",
        appearance: <></>
      },
      {
        name: "Farm Bonus",
        description: "All farms now produce 3 population.",
        appearance: <></>
      },
      {
        name: "Windmill Bonus",
        description: "All windmills now produce 2 population for every adjacent Farm.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Domestication", 
    tier: 2,
    cost: 8, 
    prereqs: ["Organisation"],
    appearance: <></>,
    unlocks: [
      {
        name: "Rider",
        description: "Unlocks the Rider troop.",
        appearance: <></>
      },
      {
        name: "Horse",
        description: "Riders can now ride Horses.",
        appearance: <></>
      },
      {
        name: "Fruits Cost Reduction",
        description: "Reduce cost of collecting fruits by 10%.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Bonding", 
    tier: 3,
    cost: 8, 
    prereqs: ["Domestication"],
    appearance: <></>,
    unlocks: [
      {
        name: "Tiger",
        description: "Riders can now ride Tigers.",
        appearance: <></>
      },
      {
        name: "Hunting Cost Reduction",
        description: "Reduce cost of hunting by 10%.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Beast", 
    tier: 4,
    cost: 8, 
    prereqs: ["Bonding"],
    appearance: <></>,
    unlocks: [
      {
        name: "Dragon",
        description: "Riders can now ride Dragons.",
        appearance: <></>
      },
      {
        name: "Dragon Egg",
        description: "Used for spawning Dragons.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Herbalism", 
    tier: 1,
    cost: 8, 
    prereqs: [],
    appearance: <></>,
    unlocks: [
      {
        name: "Regeneration",
        description: "All troops naturally regain health over time.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "First Aid", 
    tier: 2,
    cost: 8, 
    prereqs: ["Herbalism"],
    appearance: <></>,
    unlocks: [
      {
        name: "Regeneration Boost",
        description: "Regeneration rate for all troops increases by 10%.",
        appearance: <></>
      },
      {
        name: "Self-healing",
        description: "Troops can now heal themselves by some amount after a cooldown period.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Medic", 
    tier: 3,
    cost: 8, 
    prereqs: ["First Aid"],
    appearance: <></>,
    unlocks: [
      {
        name: "Medic",
        description: "Unlocks the Medic troop.",
        appearance: <></>
      },
      {
        name: "Status Effects Reduction",
        description: "Any harmful status effects deal 50% less damage.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Vitality", 
    tier: 4,
    cost: 8, 
    prereqs: ["Medic"],
    appearance: <></>,
    unlocks: [
      {
        name: "Angel",
        description: "Unlocks the Angel unit.",
        appearance: <></>
      },
      {
        name: "Heal Pool",
        description: "Capital has a heal pool within a certain radius.",
        appearance: <></>
      },
      {
        name: "Horses",
        description: "Riders can now ride Horses.",
        appearance: <></>
      },
      {
        name: "Health Boost",
        description: "All troops gain +20% more health.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Catalysis", 
    tier: 2,
    cost: 8, 
    prereqs: ["Herbalism"],
    appearance: <></>,
    unlocks: [
      {
        name: "Alchemist",
        description: "Unlocks the Alchemist troop.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Mutagenics", 
    tier: 3,
    cost: 8, 
    prereqs: ["Catalysis"],
    appearance: <></>,
    unlocks: [
      {
        name: "Acid Rain",
        description: "Alchemists can launch acid rain clouds.",
        appearance: <></>
      },
      {
        name: "Alchemist's Fire",
        description: "Alchemists can attack with fire for a number of stars.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Transmutation", 
    tier: 4,
    cost: 8, 
    prereqs: ["Mutagenics"],
    appearance: <></>,
    unlocks: [
      {
        name: "Construct",
        description: "Unlocks the Construct troop.",
        appearance: <></>
      },
      {
        name: "Philosopher's Stone",
        description: "Troops can be revived for a reduced number of stars.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Knowledge", 
    tier: 1,
    cost: 8, 
    prereqs: [],
    appearance: <></>,
    unlocks: [
      {
        name: "Literacy",
        description: "Price of all technologies is reduced by 10%.",
        appearance: <></>
      },
      {
        name: "Diplomacy",
        description: "Can make peace treaties with other civilisations.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Sigilcraft", 
    tier: 2,
    cost: 8, 
    prereqs: ["Knowledge"],
    appearance: <></>,
    unlocks: [
      {
        name: "Attack Sigil",
        description: "Boosts attack by +10% within a radius of the sigil.",
        appearance: <></>
      },
      {
        name: "Defense Sigil",
        description: "Boosts defense by +10% within a radius of the sigil.",
        appearance: <></>
      },
      {
        name: "Speed Sigil",
        description: "Boosts speed by +10% within a radius of the sigil.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Wizardry", 
    tier: 3,
    cost: 8, 
    prereqs: ["Sigilcraft"],
    appearance: <></>,
    unlocks: [
      {
        name: "Wizard",
        description: "Unlocks the Wizard troop.",
        appearance: <></>
      },
      {
        name: "Wizard Attack Defense",
        description: "Reduces damage from enemy Wizards by 20%.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Omnimancy", 
    tier: 4,
    cost: 8, 
    prereqs: ["Wizardry"],
    appearance: <></>,
    unlocks: [
      {
        name: "Mage",
        description: "Unlocks the Mage troop.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Ethics", 
    tier: 2,
    cost: 8, 
    prereqs: ["Knowledge"],
    appearance: <></>,
    unlocks: [
      {
        name: "Pacifism",
        description: "If no fighting occurs for 20 seconds, number of stars generated increases by 2.",
        appearance: <></>
      },
      {
        name: "Slow Capture",
        description: "Enemies take 15% longer time to capture cities.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Influence", 
    tier: 3,
    cost: 8, 
    prereqs: ["Ethics"],
    appearance: <></>,
    unlocks: [
      {
        name: "Propaganda Machine",
        description: "Can convert enemy troops to your own if left within the Propaganda Machine's radius for too long.",
        appearance: <></>
      },
      {
        name: "Weakened Attacks",
        description: "Enemy troops deal 10% less damage when in your territory.",
        appearance: <></>
      },
    ],
  },
  { 
    name: "Enlightenment", 
    tier: 4,
    cost: 8, 
    prereqs: ["Influence"],
    appearance: <></>,
    unlocks: [
      {
        name: "Sage",
        description: "Unlocks the Sage troop.",
        appearance: <></>
      },
      {
        name: "Sanctuary",
        description: "Enemy troops cannot deal damage when within capital's borders.",
        appearance: <></>
      },
      {
        name: "Misinformation Immunity",
        description: "All troops no longer susceptible to enemy propaganda.",
        appearance: <></>
      },
    ],
  },
];
