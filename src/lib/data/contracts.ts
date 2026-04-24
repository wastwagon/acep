import { contractDetails } from "../../../content/contract-monitor/contracts-data";

export interface ContractArea {
  id: number;
  name: string;
  block: string;
  size: number; // in sqkm
  location: string;
  operators: string[];
  status: "Active" | "Inactive" | "In Development";
  discovered?: string;
  production?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  // Scraped details from ghanacontractmonitor.com
  parties?: string[] | null;
  effectiveDate?: string | null;
  initialExplorationPeriod?: string | null;
  minimumExplorationProgram?: string[];
  minimumExpenditure?: string | null;
  updates?: Record<string, string>;
  surfaceRental?: string | null;
  sourceUrl?: string;
}

export const contractAreas: ContractArea[] = [
  {
    id: 1,
    name: "Expanded Shallow Water Tano Block",
    block: "ESWT",
    size: 1508,
    location: "Western Region - Offshore",
    operators: ["Tullow Oil", "Kosmos Energy"],
    status: "Active",
    discovered: "2007",
    production: "2010",
    coordinates: { lat: 4.75, lng: -3.08 },
  },
  {
    id: 2,
    name: "Central Tano Block",
    block: "CT",
    size: 1508,
    location: "Western Region - Offshore",
    operators: ["Aker Energy", "Lukoil"],
    status: "In Development",
    discovered: "2016",
    coordinates: { lat: 4.95, lng: -2.98 },
  },
  {
    id: 3,
    name: "Deepwater Tano-CTP Block",
    block: "DT-CTP",
    size: 3000,
    location: "Western Region - Deepwater",
    operators: ["Eni Ghana", "Vitol"],
    status: "Active",
    discovered: "2009",
    production: "2017",
    coordinates: { lat: 4.65, lng: -3.15 },
  },
  {
    id: 4,
    name: "South Deepwater Tano",
    block: "SDWT",
    size: 3482,
    location: "Western Region - Deepwater",
    operators: ["Vitol", "GNPC"],
    status: "In Development",
    coordinates: { lat: 4.55, lng: -3.25 },
  },
  {
    id: 5,
    name: "Offshore South-West Tano Block",
    block: "OSWT",
    size: 1200,
    location: "Western Region - Offshore",
    operators: ["AGM Petroleum"],
    status: "Active",
    coordinates: { lat: 4.85, lng: -2.88 },
  },
  {
    id: 6,
    name: "Shallow Water Cape Three Points Block",
    block: "SWCTP",
    size: 1500,
    location: "Western Region - Shallow Water",
    operators: ["Springfield E&P"],
    status: "Active",
    discovered: "2016",
    coordinates: { lat: 4.72, lng: -2.05 },
  },
  {
    id: 7,
    name: "East Cape Three Point",
    block: "ECTP",
    size: 1565,
    location: "Western Region - Offshore",
    operators: ["Oranto Petroleum"],
    status: "In Development",
    coordinates: { lat: 4.68, lng: -1.95 },
  },
  {
    id: 8,
    name: "Deepwater Cape Three Points",
    block: "DWCTP",
    size: 2800,
    location: "Western Region - Deepwater",
    operators: ["Kosmos Energy", "BP"],
    status: "Active",
    coordinates: { lat: 4.58, lng: -2.15 },
  },
  {
    id: 9,
    name: "South West Saltpond Block",
    block: "SWSP",
    size: 1350,
    location: "Central Region - Offshore",
    operators: ["Lukoil", "GNPC"],
    status: "In Development",
    coordinates: { lat: 5.05, lng: -1.25 },
  },
  {
    id: 10,
    name: "Cape Three Points Block 4",
    block: "CTP-4",
    size: 1127,
    location: "Western Region - Offshore",
    operators: ["Eni Ghana"],
    status: "Active",
    coordinates: { lat: 4.78, lng: -2.25 },
  },
  {
    id: 11,
    name: "Onshore/Offshore Keta Delta Block",
    block: "KDB",
    size: 3000,
    location: "Volta Region - Onshore/Offshore",
    operators: ["Afren Energy", "GNPC"],
    status: "Inactive",
    coordinates: { lat: 5.88, lng: 0.95 },
  },
  {
    id: 12,
    name: "Offshore Cape Three Points South Block",
    block: "OCTPS",
    size: 1450,
    location: "Western Region - Offshore",
    operators: ["Vanco Energy"],
    status: "In Development",
    coordinates: { lat: 4.62, lng: -2.35 },
  },
  {
    id: 13,
    name: "Deepwater Cape Three Points West Offshore",
    block: "DWCTPW",
    size: 2900,
    location: "Western Region - Deepwater",
    operators: ["Kosmos Energy"],
    status: "Active",
    coordinates: { lat: 4.52, lng: -2.45 },
  },
  {
    id: 14,
    name: "West Cape Three Points Block 2",
    block: "WCTP-2",
    size: 673,
    location: "Western Region - Offshore",
    operators: ["Hess Corporation", "GNPC"],
    status: "Active",
    coordinates: { lat: 4.82, lng: -2.55 },
  },
  {
    id: 15,
    name: "East Keta Block",
    block: "EKB",
    size: 2239,
    location: "Volta Region - Offshore",
    operators: ["Oranto Petroleum"],
    status: "In Development",
    coordinates: { lat: 5.78, lng: 1.15 },
  },
];

export function getContractById(id: number): ContractArea | undefined {
  const contract = contractAreas.find((contract) => contract.id === id);
  if (!contract) return undefined;

  // Merge with scraped details
  const scrapedDetails = contractDetails.find((d) => d.id === id);
  if (scrapedDetails) {
    return {
      ...contract,
      parties: scrapedDetails.parties,
      effectiveDate: scrapedDetails.effectiveDate,
      initialExplorationPeriod: scrapedDetails.initialExplorationPeriod,
      minimumExplorationProgram: scrapedDetails.minimumExplorationProgram,
      minimumExpenditure: scrapedDetails.minimumExpenditure,
      updates: scrapedDetails.updates,
      surfaceRental: scrapedDetails.surfaceRental,
      sourceUrl: scrapedDetails.url,
    };
  }

  return contract;
}

export function getTotalContractArea(): number {
  return contractAreas.reduce((total, contract) => total + contract.size, 0);
}

export function getActiveContracts(): ContractArea[] {
  return contractAreas.filter((contract) => contract.status === "Active");
}

export function getContractsByStatus(status: ContractArea["status"]): ContractArea[] {
  return contractAreas.filter((contract) => contract.status === status);
}
