import { useGame } from "~/contexts/GameContext";
import { NUM_ROWS, DEFAULT_COLOUR } from "~/constants/meta";
import { TERRAIN_COLOURS } from "~/constants/terrain";
import { FEATURES } from "~/constants/features"; 
import { Button } from "~/components/ui/button";

export function SetupHUD() {
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

  const startGame = () => {
    setGameStarted(true);
  }

  return (
    <>
      <div className="absolute z-20 bottom-5 right-5 flex flex-col gap-3">
        <Button size="lg" className="cursor-pointer" onClick={generateTerrain}>Generate Terrain</Button>
        <Button size="lg" className="cursor-pointer" onClick={clearBoard}>Clear Board</Button>
        <Button size="lg" className="cursor-pointer" onClick={startGame}>Start Game</Button>
      </div>
    </>
  );
}
