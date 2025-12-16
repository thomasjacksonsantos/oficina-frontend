'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useProductContext } from './product-context';
import DeleteProductForm from '../form/delete-product-form';
import EditProductDialog from '../form/product-edit-dialog';
import ViewProductDialog from '../form/product-view-dialog';
import RegisterProductForm from '../form/product-form';

export default function ProductHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingProduct, setDeletingProduct, setRegisteringProduct } = useProductContext();

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
        title="Deletar Produto"
        description="Tem certeza que deseja deletar este produto?"
      >
        {deletingProduct && <DeleteProductForm productId={deletingProduct.id} setIsOpen={handleCloseDelete} />}
      </ResponsiveDialog>
      <EditProductDialog />
      <ViewProductDialog />
      <RegisterProductForm />
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