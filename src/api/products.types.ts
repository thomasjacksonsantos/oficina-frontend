export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  stock?: number;
  category?: string;
  sku?: string;
  barcode?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateProductInput = Partial<CreateProductInput>

