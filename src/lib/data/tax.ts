// Tax collection data and statistics for OpenTax platform

export interface TaxRevenue {
  year: number;
  totalRevenue: number; // in GHS billions
  domesticTax: number;
  customsTax: number;
  personalIncomeTax: number;
  corporateIncomeTax: number;
  vat: number;
  mineralRoyalties: number;
  otherTaxes: number;
  growthRate: number; // percentage
  taxToGDP: number; // percentage
}

export interface TaxSource {
  id: string;
  name: string;
  description: string;
  percentage: number;
  amount: number; // in GHS billions
  growthRate: number;
  icon: string;
}

export interface WhistleblowerReport {
  id: number;
  category: "Tax Evasion" | "Fraud" | "Corruption" | "Non-Compliance" | "Other";
  status: "Pending" | "Under Review" | "Validated" | "Resolved" | "Rejected";
  rewardAmount?: number; // in GHS
  reportedAt: Date;
  resolvedAt?: Date;
}

export const taxRevenueData: TaxRevenue[] = [
  {
    year: 2019,
    totalRevenue: 45.2,
    domesticTax: 32.5,
    customsTax: 12.7,
    personalIncomeTax: 8.1,
    corporateIncomeTax: 6.8,
    vat: 12.4,
    mineralRoyalties: 2.1,
    otherTaxes: 2.8,
    growthRate: 18.5,
    taxToGDP: 12.2,
  },
  {
    year: 2020,
    totalRevenue: 47.8,
    domesticTax: 34.2,
    customsTax: 13.6,
    personalIncomeTax: 8.5,
    corporateIncomeTax: 7.2,
    vat: 13.1,
    mineralRoyalties: 2.3,
    otherTaxes: 3.0,
    growthRate: 5.8,
    taxToGDP: 12.5,
  },
  {
    year: 2021,
    totalRevenue: 57.3,
    domesticTax: 41.8,
    customsTax: 15.5,
    personalIncomeTax: 9.8,
    corporateIncomeTax: 8.9,
    vat: 15.2,
    mineralRoyalties: 3.1,
    otherTaxes: 3.5,
    growthRate: 19.9,
    taxToGDP: 13.1,
  },
  {
    year: 2022,
    totalRevenue: 75.7,
    domesticTax: 55.2,
    customsTax: 20.5,
    personalIncomeTax: 12.4,
    corporateIncomeTax: 11.8,
    vat: 18.6,
    mineralRoyalties: 4.2,
    otherTaxes: 4.8,
    growthRate: 32.1,
    taxToGDP: 13.6,
  },
  {
    year: 2023,
    totalRevenue: 113.06,
    domesticTax: 82.5,
    customsTax: 30.56,
    personalIncomeTax: 18.2,
    corporateIncomeTax: 15.8,
    vat: 24.5,
    mineralRoyalties: 6.8,
    otherTaxes: 7.2,
    growthRate: 49.3,
    taxToGDP: 14.1,
  },
  {
    year: 2024,
    totalRevenue: 125.4,
    domesticTax: 91.5,
    customsTax: 33.9,
    personalIncomeTax: 20.1,
    corporateIncomeTax: 17.5,
    vat: 27.2,
    mineralRoyalties: 7.5,
    otherTaxes: 8.0,
    growthRate: 10.9,
    taxToGDP: 14.5,
  },
];

export const taxSources: TaxSource[] = [
  {
    id: "domestic-tax",
    name: "Domestic Tax Revenue",
    description: "Taxes collected from domestic sources including PIT, CIT, VAT, and other domestic taxes",
    percentage: 73,
    amount: 91.5,
    growthRate: 10.9,
    icon: "Building2",
  },
  {
    id: "customs",
    name: "Customs Revenue",
    description: "Import duties, export duties, and other customs-related taxes",
    percentage: 27,
    amount: 33.9,
    growthRate: 10.8,
    icon: "Package",
  },
  {
    id: "pit",
    name: "Personal Income Tax",
    description: "Tax on individual income from employment, business, and investments",
    percentage: 16,
    amount: 20.1,
    growthRate: 10.4,
    icon: "User",
  },
  {
    id: "cit",
    name: "Corporate Income Tax",
    description: "Tax on corporate profits and business income",
    percentage: 14,
    amount: 17.5,
    growthRate: 10.8,
    icon: "Briefcase",
  },
  {
    id: "vat",
    name: "Value Added Tax",
    description: "Consumption tax on goods and services",
    percentage: 22,
    amount: 27.2,
    growthRate: 11.0,
    icon: "ShoppingCart",
  },
  {
    id: "royalties",
    name: "Mineral Royalties",
    description: "Royalties from mining and mineral extraction",
    percentage: 6,
    amount: 7.5,
    growthRate: 10.3,
    icon: "Mountain",
  },
];

export const taxStats = {
  totalRevenue2024: 125.4, // GHS billions
  totalRevenue2023: 113.06,
  growthRate: 10.9,
  taxToGDP: 14.5,
  totalTaxpayers: 2500000,
  activeBusinesses: 850000,
  whistleblowerRewards: {
    totalPaid: 12.5, // GHS millions
    totalReports: 1847,
    validatedReports: 342,
    averageReward: 36500,
    maxReward: 250000,
    minReward: 25000,
  },
};

export const whistleblowerCategories = [
  "Tax Evasion",
  "Fraud",
  "Corruption",
  "Non-Compliance",
  "Under-declaration",
  "False Documentation",
  "Other",
];

export function getLatestRevenue(): TaxRevenue {
  return taxRevenueData[taxRevenueData.length - 1];
}

export function getRevenueByYear(year: number): TaxRevenue | undefined {
  return taxRevenueData.find((r) => r.year === year);
}

export function getTotalRevenue(): number {
  return taxRevenueData.reduce((sum, r) => sum + r.totalRevenue, 0);
}

export function getAverageGrowthRate(): number {
  const rates = taxRevenueData.map((r) => r.growthRate);
  return rates.reduce((sum, r) => sum + r, 0) / rates.length;
}
