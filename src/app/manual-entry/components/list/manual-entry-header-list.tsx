'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus, FileDown, FileUp, FileText, Power, Unlock } from 'lucide-react';
import { useManualEntryContext } from './manual-entry-context';
import DeleteManualEntryForm from '../form/delete-manual-entry-form';
import ManualEntryEditDialog from '../form/manual-entry-edit-dialog';
import ManualEntryViewDialog from '../form/manual-entry-view-dialog';
import ManualEntryForm from '../form/manual-entry-form';

export default function ManualEntryHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingEntry, setDeletingEntry, setRegisteringEntry } = useManualEntryContext();

  useEffect(() => {
    if (deletingEntry) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingEntry]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingEntry(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar entrada manual"
        description="Tem certeza que deseja deletar esta entrada manual?"
      >
        {deletingEntry && (
          <DeleteManualEntryForm entryId={deletingEntry.id} setIsOpen={handleCloseDelete} />
        )}
      </ResponsiveDialog>
      <ManualEntryEditDialog />
      <ManualEntryViewDialog />
      <ManualEntryForm />
      <div className="flex mb-2 flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Entrada Manual</h2>
          <span className="text-muted-foreground">Gerencie suas entradas manuais aqui.</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setRegisteringEntry(true)} variant="default">
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Entrada
          </Button>
        </div>
      </div>
    </>
  );
}
