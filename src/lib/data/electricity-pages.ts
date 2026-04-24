// Helper to get electricity page content from scraped data
import { electricityPages } from "../../../content/electricity-monitor/electricity-data";

export function getElectricityPage(id: string) {
  return electricityPages.find((page) => page.id === id);
}

export function getAllElectricityPages() {
  return electricityPages;
}
