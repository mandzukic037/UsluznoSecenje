export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
  material?: string;
  thickness?: string;
}