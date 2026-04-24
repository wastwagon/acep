export interface RevenueData {
  year: number;
  quarter?: number;
  amount: number; // in millions USD
  barrels: number; // barrels per day
  category: "Infrastructure" | "Education" | "Health" | "Agriculture" | "Other";
}

export interface Project {
  id: number;
  name: string;
  location: string;
  region: string;
  category: "Infrastructure" | "Education" | "Health" | "Agriculture";
  fundingAmount: number; // in millions USD
  status: "Completed" | "Ongoing" | "Planned";
  startYear: number;
  completionYear?: number;
  beneficiaries: number;
  description: string;
}

export const oilRevenueStats = {
  totalRevenue: 9480, // $9.48B in millions
  totalRevenueSince2010: 14030, // $14.03B in millions
  averageAnnualRevenue: 935, // $935M in millions
  peakRevenue: 1645, // $1,645M in 2013
  peakYear: 2013,
  currentProduction: 212000, // barrels per day
  productionGrowth: 12.4, // % from 2023
  totalProjects: 438,
  activeProjects: 24,
  totalBeneficiaries: 5700000, // 5.7M
  beneficiariesPercentage: 16.8,
};

// Sample revenue data by year
export const annualRevenue: RevenueData[] = [
  { year: 2010, amount: 444, barrels: 55000, category: "Infrastructure" },
  { year: 2011, amount: 888, barrels: 70000, category: "Infrastructure" },
  { year: 2012, amount: 1324, barrels: 85000, category: "Infrastructure" },
  { year: 2013, amount: 1645, barrels: 110000, category: "Infrastructure" },
  { year: 2014, amount: 1398, barrels: 100000, category: "Infrastructure" },
  { year: 2015, amount: 789, barrels: 95000, category: "Infrastructure" },
  { year: 2016, amount: 652, barrels: 85000, category: "Infrastructure" },
  { year: 2017, amount: 876, barrels: 105000, category: "Infrastructure" },
  { year: 2018, amount: 1123, barrels: 145000, category: "Infrastructure" },
  { year: 2019, amount: 1265, barrels: 175000, category: "Infrastructure" },
  { year: 2020, amount: 945, barrels: 165000, category: "Infrastructure" },
  { year: 2021, amount: 1187, barrels: 180000, category: "Infrastructure" },
  { year: 2022, amount: 1345, barrels: 190000, category: "Infrastructure" },
  { year: 2023, amount: 1598, barrels: 195000, category: "Infrastructure" },
  { year: 2024, amount: 1789, barrels: 212000, category: "Infrastructure" },
];

// Revenue allocation by category (2010-2024)
export const revenueAllocation = [
  { category: "Infrastructure", amount: 6215, percentage: 44.3, projects: 198 },
  { category: "Education", amount: 3506, percentage: 25.0, projects: 125 },
  { category: "Health", amount: 2526, percentage: 18.0, projects: 87 },
  { category: "Agriculture", amount: 1783, percentage: 12.7, projects: 28 },
];

// Sample projects
export const sampleProjects: Project[] = [
  {
    id: 1,
    name: "Zuedem Irrigation Project",
    location: "Zuedem, Upper East Region",
    region: "Upper East",
    category: "Agriculture",
    fundingAmount: 18.5,
    status: "Completed",
    startYear: 2015,
    completionYear: 2018,
    beneficiaries: 5200,
    description: "Large-scale irrigation infrastructure to support year-round farming",
  },
  {
    id: 2,
    name: "Zakpalsi Irrigation Dam",
    location: "Zakpalsi, Northern Region",
    region: "Northern",
    category: "Agriculture",
    fundingAmount: 22.3,
    status: "Completed",
    startYear: 2014,
    completionYear: 2019,
    beneficiaries: 7800,
    description: "Irrigation dam to enhance agricultural productivity",
  },
  {
    id: 3,
    name: "Twifo Ayaase Methodist Primary School",
    location: "Twifo Ayaase, Central Region",
    region: "Central",
    category: "Education",
    fundingAmount: 2.1,
    status: "Completed",
    startYear: 2016,
    completionYear: 2017,
    beneficiaries: 850,
    description: "School infrastructure development with modern facilities",
  },
  {
    id: 4,
    name: "Otuam Community Water Project",
    location: "Otuam, Central Region",
    region: "Central",
    category: "Infrastructure",
    fundingAmount: 3.8,
    status: "Completed",
    startYear: 2017,
    completionYear: 2018,
    beneficiaries: 12000,
    description: "Clean water supply infrastructure for rural community",
  },
  {
    id: 5,
    name: "Western Region Rural Electrification",
    location: "Multiple Communities, Western Region",
    region: "Western",
    category: "Infrastructure",
    fundingAmount: 45.7,
    status: "Ongoing",
    startYear: 2020,
    beneficiaries: 85000,
    description: "Extending electricity grid to underserved rural areas",
  },
  {
    id: 6,
    name: "Northern Health Facilities Upgrade",
    location: "Northern Region Hospitals",
    region: "Northern",
    category: "Health",
    fundingAmount: 28.4,
    status: "Ongoing",
    startYear: 2022,
    beneficiaries: 150000,
    description: "Upgrading equipment and facilities in regional hospitals",
  },
];

export function getTotalRevenue(): number {
  return annualRevenue.reduce((total, data) => total + data.amount, 0);
}

export function getRevenueByYear(year: number): RevenueData | undefined {
  return annualRevenue.find((data) => data.year === year);
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return sampleProjects.filter((project) => project.category === category);
}

export function getProjectsByStatus(status: Project["status"]): Project[] {
  return sampleProjects.filter((project) => project.status === status);
}
