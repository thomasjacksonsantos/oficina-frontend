// app/product-unit/components/list/product-unit-header-list.tsx

'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useUnitContext } from './product-unit-context';
import DeleteUnitForm from '../form/delete-product-unit-form';
import EditUnitDialog from '../form/product-unit-edit-dialog';
import ViewUnitDialog from '../form/product-unit-view-dialog';
import CreateUnitDialog from '../form/product-unit-create-dialog';

export default function UnitHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { deletingUnit, setDeletingUnit } = useUnitContext();

  useEffect(() => {
    if (deletingUnit) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingUnit]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingUnit(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar unidade"
        description="Tem certeza que deseja deletar esta unidade?"
      >
        {deletingUnit && <DeleteUnitForm unitId={deletingUnit.id} setIsOpen={handleCloseDelete} />}
      </ResponsiveDialog>
      <EditUnitDialog />
      <ViewUnitDialog />
      <CreateUnitDialog isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Unidades</h2>
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