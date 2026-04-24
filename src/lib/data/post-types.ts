// Post type definition - safe for client components
// This file contains only type definitions, no Node.js imports

export interface Post {
  url: string;
  title: string;
  featuredImage?: string;
  dateText?: string;
  excerpt?: string;
  content?: string;
  pdfLinks: Array<{ url: string; text: string }>;
  category?: string;
  tags: string[];
}
