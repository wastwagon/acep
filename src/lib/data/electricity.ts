export interface PowerPlant {
  id: number;
  name: string;
  location: string;
  type: "Hydro Power Plant" | "Thermal Power Plant" | "Solar Power Plant" | "Wind Power Plant";
  installedCapacity: number; // MW
  dependableCapacity: number; // MW
  region: string;
  status: "Active" | "Inactive" | "Under Maintenance";
}

export const powerPlants: PowerPlant[] = [
  // Hydroelectric Power Stations
  {
    id: 1,
    name: "Akosombo Hydroelectric Power Station",
    location: "Akosombo (Eastern Region)",
    type: "Hydro Power Plant",
    installedCapacity: 1020,
    dependableCapacity: 900,
    region: "Eastern Region",
    status: "Active",
  },
  {
    id: 2,
    name: "Kpong Hydroelectric Power Station",
    location: "Akuse (Eastern Region)",
    type: "Hydro Power Plant",
    installedCapacity: 160,
    dependableCapacity: 140,
    region: "Eastern Region",
    status: "Active",
  },
  {
    id: 3,
    name: "Bui Hydroelectric Power Station",
    location: "Bui Gorge (Border Between Northern and Bono Region)",
    type: "Hydro Power Plant",
    installedCapacity: 400,
    dependableCapacity: 360,
    region: "Bono Region",
    status: "Active",
  },
  {
    id: 4,
    name: "Tsatsadu Mini Hydro",
    location: "Hohoe District (Volta Region)",
    type: "Hydro Power Plant",
    installedCapacity: 0.045,
    dependableCapacity: 0.045,
    region: "Volta Region",
    status: "Active",
  },
  // Thermal Power Stations
  {
    id: 5,
    name: "Takoradi Power Company (TAPCO)",
    location: "Takoradi (Western Region)",
    type: "Thermal Power Plant",
    installedCapacity: 330,
    dependableCapacity: 300,
    region: "Western Region",
    status: "Active",
  },
  {
    id: 6,
    name: "Takoradi International Company (TICO)",
    location: "Takoradi (Western Region)",
    type: "Thermal Power Plant",
    installedCapacity: 340,
    dependableCapacity: 320,
    region: "Western Region",
    status: "Active",
  },
  {
    id: 7,
    name: "Tema Thermal 1 Power Plant (TT1PP)",
    location: "Tema (Greater Accra Region)",
    type: "Thermal Power Plant",
    installedCapacity: 110,
    dependableCapacity: 100,
    region: "Greater Accra",
    status: "Active",
  },
  {
    id: 8,
    name: "Tema Thermal 2 Power Plant (TT2PP)",
    location: "Tema (Greater Accra Region)",
    type: "Thermal Power Plant",
    installedCapacity: 87,
    dependableCapacity: 70,
    region: "Greater Accra",
    status: "Active",
  },
];

export interface ElectricityStats {
  nationalAccess: number; // percentage
  ruralAccess: number; // percentage
  urbanAccess: number; // percentage
  totalCustomers: number;
  totalInstalledCapacity: number; // MW
  totalDependableCapacity: number; // MW
}

export const electricityStats: ElectricityStats = {
  nationalAccess: 89.4,
  ruralAccess: 76.7,
  urbanAccess: 100,
  totalCustomers: 5566711,
  totalInstalledCapacity: 2447.045,
  totalDependableCapacity: 2190.045,
};

export interface Complaint {
  id: number;
  name: string;
  email: string;
  phone: string;
  region: string;
  district: string;
  category: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: Date;
}

export function getTotalInstalledCapacity(): number {
  return powerPlants.reduce((total, plant) => total + plant.installedCapacity, 0);
}

export function getTotalDependableCapacity(): number {
  return powerPlants.reduce((total, plant) => total + plant.dependableCapacity, 0);
}

export function getPowerPlantsByType(type: PowerPlant["type"]): PowerPlant[] {
  return powerPlants.filter((plant) => plant.type === type);
}

export function getActivePowerPlants(): PowerPlant[] {
  return powerPlants.filter((plant) => plant.status === "Active");
}
