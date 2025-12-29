'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useProductContext } from './product-context';
import DeleteProductForm from '../form/delete-product-form';
import ProductEditDialog from '../form/product-edit-dialog';
import ProductViewDialog from '../form/product-view-dialog';
import ProductForm from '../form/product-form';

export default function ProductHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingProduct, setDeletingProduct, setRegisteringProduct, registeringProduct } =
    useProductContext();

  useEffect(() => {
    if (deletingProduct) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingProduct]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingProduct(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar produto"
        description="Tem certeza que deseja deletar este produto?"
      >
        {deletingProduct && (
          <DeleteProductForm productId={deletingProduct.id} setIsOpen={handleCloseDelete} />
        )}
      </ResponsiveDialog>
      <ProductEditDialog />
      <ProductViewDialog />
      <ProductForm isOpen={registeringProduct || false} setIsOpen={setRegisteringProduct} />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
          <span className="text-muted-foreground">Gerencie seus produtos aqui.</span>
        </div>
        <div>
          <Button onClick={() => setRegisteringProduct(true)} variant="default">
            <FilePlus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>
    </>
  );
}
