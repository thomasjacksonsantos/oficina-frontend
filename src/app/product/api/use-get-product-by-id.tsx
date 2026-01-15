// app/product/api/use-get-product-by-id.tsx

import ProductsApi from '@/api/product.api';
import { useQuery } from '@tanstack/react-query';
import { UpdateProductInput } from '@/api/product.types';

export function useGetProductById(id: string | null | undefined) {
  return useQuery<UpdateProductInput>({
    queryKey: ['getProductById', id],
    queryFn: () => ProductsApi.getProductById(id as string),
    enabled: !!id,
  });
}
