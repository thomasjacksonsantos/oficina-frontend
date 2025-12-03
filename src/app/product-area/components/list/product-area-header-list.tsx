'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useAreaContext } from './product-area-context';
import { Link } from '@tanstack/react-router';
import DeleteAreaForm from '../form/delete-product-area-form';
import EditAreaDialog from '../form/product-area-edit-dialog';
import ViewAreaDialog from '../form/product-area-view-dialog';
import RegisterAreaForm from '../form/product-area-form';

export default function AreaHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingArea, setDeletingArea, setRegisteringArea } = useAreaContext();

  useEffect(() => {
    if (deletingArea) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingArea]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingArea(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar área"
        description="Tem certeza que deseja deletar esta área?"
      >
        {deletingArea && <DeleteAreaForm areaId={deletingArea.id} setIsOpen={handleCloseDelete} />}
      </ResponsiveDialog>
      <EditAreaDialog />
      <ViewAreaDialog />
    <RegisterAreaForm />
      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Áreas</h2>
          <span className="text-muted-foreground">Gerencie suas áreas aqui.</span>
        </div>
        <div>
            <Button onClick={() => setRegisteringArea(true)} variant="default">
              <FilePlus className="mr-2 h-4 w-4" />
              Nova Área
            </Button>
        </div>
      </div>
    </>
  );
}
