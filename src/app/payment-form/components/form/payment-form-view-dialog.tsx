'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { usePaymentFormContext } from '../list/payment-form-context';

export default function PaymentFormViewDialog() {
  const { viewingPaymentForm, setViewingPaymentForm } = usePaymentFormContext();

  if (!viewingPaymentForm) return null;

  return (
    <Dialog open={!!viewingPaymentForm} onOpenChange={() => setViewingPaymentForm(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Forma de Pagamento</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p className="font-medium">{viewingPaymentForm.descricao}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Número de Parcelas</Label>
              <p className="font-medium">{viewingPaymentForm.numeroParcela}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Tipo de Pagamento</Label>
              <p className="font-medium">{viewingPaymentForm.tipoPagamento}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="font-medium">{viewingPaymentForm.status || 'Ativo'}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Plano de Parcelamento</Label>
              <p className="font-medium">{viewingPaymentForm.planoParcelamento}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}