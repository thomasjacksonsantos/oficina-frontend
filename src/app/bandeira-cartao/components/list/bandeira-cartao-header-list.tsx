'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useBandeiraCartaoContext } from './bandeira-cartao-context';
import DeleteBandeiraCartaoForm from '../form/delete-bandeira-cartao-form';
import EditBandeiraCartaoDialog from '../form/bandeira-cartao-edit-dialog';
import ViewBandeiraCartaoDialog from '../form/bandeira-cartao-view-dialog';
import RegisterBandeiraCartaoForm from '../form/bandeira-cartao-form';

export default function BandeiraCartaoHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingBandeiraCartao, setDeletingBandeiraCartao, setRegisteringBandeiraCartao } = useBandeiraCartaoContext();

  useEffect(() => {
    if (deletingBandeiraCartao) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingBandeiraCartao]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingBandeiraCartao(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar bandeira de cartão"
        description="Tem certeza que deseja deletar esta bandeira de cartão?"
      >
        {deletingBandeiraCartao && (
          <DeleteBandeiraCartaoForm bandeiraCartaoId={deletingBandeiraCartao.id} setIsOpen={handleCloseDelete} />
        )}
      </ResponsiveDialog>
      <EditBandeiraCartaoDialog />
      <ViewBandeiraCartaoDialog />
      <RegisterBandeiraCartaoForm />
      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bandeiras de Cartão</h2>
          <span className="text-muted-foreground">Gerencie suas bandeiras de cartão aqui.</span>
        </div>
        <div>
          <Button onClick={() => setRegisteringBandeiraCartao(true)} variant="default">
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Bandeira
          </Button>
        </div>
      </div>
    </>
  );
}