'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useProductGroupContext } from './product-group-context';
import { Link } from '@tanstack/react-router';
import DeleteProductGroupForm from '../form/delete-product-group-form';
import EditProductGroupDialog from '../form/product-group-edit-dialog';
import ViewProductGroupDialog from '../form/product-group-view-dialog';

export default function ProductGroupHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingProductGroup, setDeletingProductGroup } = useProductGroupContext();
  
  useEffect(() => {
    if (deletingProductGroup) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingProductGroup]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingProductGroup(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar grupo de produto"
        description="Tem certeza que deseja deletar este grupo de produto?"
      >
        {deletingProductGroup && (
          <DeleteProductGroupForm 
            productGroupId={deletingProductGroup.id} 
            setIsOpen={handleCloseDelete} 
          />
        )}
      </ResponsiveDialog>
      <EditProductGroupDialog />
      <ViewProductGroupDialog />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Grupos de Produtos</h2>
          <span className="text-muted-foreground">Gerencie seus grupos de produtos aqui.</span>
        </div>
        <div>
          <Link to="/grupos-produtos/new">
            <Button variant="default">
              <FilePlus className="mr-2 h-4 w-4" />
              Novo Grupo
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
