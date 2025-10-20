import LandscapeIcon from '@mui/icons-material/Landscape';
import DiamondIcon from '@mui/icons-material/Diamond';

export const FEATURES = {
  Mountain: {
    color: "#6D6A6A",
    spawnsOn: ["Desert", "Grass", "Snow"], 
    appearance: {
      Desert: <LandscapeIcon className="text-[#6D6A6A]" />,
      Grass: <LandscapeIcon className="text-[#6D6A6A]" />,
      Snow: <LandscapeIcon className="text-[#6D6A6A]" />
    },
    minPerBiome: 2,
    maxPerBiome: 6
  },
  Diamond: {
    color: "#1E6182",
    spawnsOn: ["Desert", "Grass"], 
    appearance: {
      Desert: <DiamondIcon className="text-[#1E6182]" />,
      Grass: <DiamondIcon />,
    },
    minPerBiome: 8,
    maxPerBiome: 12
  },
  Volcano: {
    color: "#F85353",
    spawnsOn: ["Ocean"], 
    appearance: {
      Ocean: <div className="w-[90%] h-[90%] rounded-full border-5 border-[#F85353]" />
    },
    minPerBiome: 1,
    maxPerBiome: 10
  }
};
