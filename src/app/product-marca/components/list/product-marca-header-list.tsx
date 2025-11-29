// app/product-marca/components/list/product-marca-header-list.tsx

'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useMarcaContext } from './product-marca-context';
import DeleteMarcaForm from '../form/delete-product-marca-form';
import EditMarcaDialog from '../form/product-marca-edit-dialog';
import ViewMarcaDialog from '../form/product-marca-view-dialog';
import CreateMarcaDialog from '../form/product-marca-create-dialog';

export default function MarcaHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { deletingMarca, setDeletingMarca } = useMarcaContext();

  useEffect(() => {
    if (deletingMarca) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingMarca]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingMarca(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar unidade"
        description="Tem certeza que deseja deletar esta unidade?"
      >
        {deletingMarca && <DeleteMarcaForm marcaId={deletingMarca.id} setIsOpen={handleCloseDelete} />}
      </ResponsiveDialog>
      <EditMarcaDialog />
      <ViewMarcaDialog />
      <CreateMarcaDialog isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Marca</h2>
          <span className="text-muted-foreground">Gerencie suas unidades aqui.</span>
        </div>
        <div>
          <Button variant="default" onClick={() => setIsCreateOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Unidade
          </Button>
        </div>
      </div>
    </>
  );
}
