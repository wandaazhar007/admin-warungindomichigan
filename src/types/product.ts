export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stockQuantity: number;
  dimensions: {
    size?: string;
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
  };
  createdAt: string; // or Date
  updatedAt: string; // or Date
}

export interface ProductFormData {
  name: string;
  slug: string; // <-- ADD THIS LINE
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl?: string;
}