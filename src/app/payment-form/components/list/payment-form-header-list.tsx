'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { usePaymentFormContext } from './payment-form-context';
import DeletePaymentFormForm from '../form/delete-payment-form-form';
import EditPaymentFormDialog from '../form/payment-form-edit-dialog';
import ViewPaymentFormDialog from '../form/payment-form-view-dialog';
import RegisterPaymentFormForm from '../form/payment-form-form';

export default function PaymentFormHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingPaymentForm, setDeletingPaymentForm, setRegisteringPaymentForm } = usePaymentFormContext();

  useEffect(() => {
    if (deletingPaymentForm) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingPaymentForm]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingPaymentForm(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar Forma de Pagamento"
        description="Tem certeza que deseja deletar esta forma de pagamento?"
      >
        {deletingPaymentForm && <DeletePaymentFormForm paymentFormId={deletingPaymentForm.id} setIsOpen={handleCloseDelete} />}
      </ResponsiveDialog>
      <EditPaymentFormDialog />
      <ViewPaymentFormDialog />
      <RegisterPaymentFormForm />
      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Formas de Pagamento</h2>
          <span className="text-muted-foreground">Gerencie as formas de pagamento aqui.</span>
        </div>
        <div>
          <Button onClick={() => setRegisteringPaymentForm(true)} variant="default">
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Forma de Pagamento
          </Button>
        </div>
      </div>
    </>
  );
}