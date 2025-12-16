'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useBandeiraCartaoContext } from '../list/bandeira-cartao-context';

export default function BandeiraCartaoViewDialog() {
  const { viewingBandeiraCartao, setViewingBandeiraCartao } = useBandeiraCartaoContext();

  if (!viewingBandeiraCartao) return null;

  return (
    <Dialog open={!!viewingBandeiraCartao} onOpenChange={() => setViewingBandeiraCartao(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Bandeira de Cartão</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Descrição da Bandeira</Label>
              <p className="font-medium">{viewingBandeiraCartao.descricao}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Plano de Conta dos Recebimentos</Label>
              <p className="font-medium">{viewingBandeiraCartao.planoContaRecebimento}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Forma de Recebimento</Label>
              <p className="font-medium">{viewingBandeiraCartao.formaPagamento}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Banco</Label>
              <p className="font-medium">{viewingBandeiraCartao.banco.nome}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="font-medium">{viewingBandeiraCartao.status || 'Ativo'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
