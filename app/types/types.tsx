
export interface Product {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    price: number;
    colors: string[];
    sizes: string[];
    category: string;
  }

  export type FilterOptions = {
    category: string;
    minPrice: number;
    maxPrice: number;
    sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  };
  