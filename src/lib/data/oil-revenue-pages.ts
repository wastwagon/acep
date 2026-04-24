// Helper to get oil revenue page content from scraped data
import { oilRevenuePages } from "../../../content/oil-revenue/oil-revenue-data";

export function getOilRevenuePage(id: string) {
  return oilRevenuePages.find((page) => page.id === id);
}

export function getAllOilRevenuePages() {
  return oilRevenuePages;
}
