'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useSupplierContext } from './supplier-context';
import { Link } from '@tanstack/react-router';
import DeleteSupplierForm from '../forms/delete-supplier-form';
import EditSupplierForm from '../form/supplier-edit-dialog';
import ViewSupplierForm from '../form/supplier-view-dialog';

export default function SupplierHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingSupplier, setDeletingSupplier } = useSupplierContext();

  useEffect(() => {
    if (deletingSupplier) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingSupplier]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingSupplier(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar fornecedor"
        description="Tem certeza que deseja deletar este fornecedor?"
      >
        {deletingSupplier && (
          <DeleteSupplierForm supplierId={deletingSupplier.id} setIsOpen={handleCloseDelete} />
        )}
      </ResponsiveDialog>
      <EditSupplierForm />
      <ViewSupplierForm />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fornecedores</h2>
          <span className="text-muted-foreground">Gerencie seus fornecedores aqui.</span>
        </div>
        <div>
          <Link to="/fornecedores/new">
            <Button variant="default">
              <FilePlus className="mr-2 h-4 w-4" />
              Novo Fornecedor
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
