// app/store-transfer/components/forms/store-transfer-view-dialog.tsx

'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStoreTransferContext } from '../list/store-transfer-context';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useGetStoreTransferById } from '@/app/store-transfer/api';

export default function StoreTransferViewDialog() {
  const { viewingStoreTransfer, setViewingStoreTransfer } = useStoreTransferContext();

  const { data: storeTransferDetail, isLoading } = useGetStoreTransferById(
    viewingStoreTransfer?.id || null
  );

  if (!viewingStoreTransfer) return null;

  const date = new Date(viewingStoreTransfer.data);

  return (
    <Dialog open={!!viewingStoreTransfer} onOpenChange={() => setViewingStoreTransfer(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Transferência de Estoque</DialogTitle>
        </DialogHeader>

        <Separator />

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando detalhes...</div>
        ) : storeTransferDetail ? (
          <div className="space-y-4">
            {/* Product Information */}
            <div className="grid gap-4 md:grid-cols-1">
              <div>
                <Label className="text-muted-foreground">Produto</Label>
                <p className="font-medium text-lg">{storeTransferDetail.descricao}</p>
              </div>
            </div>

            {/* Transfer Information */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">Loja Origem</Label>
                <p className="font-medium">{storeTransferDetail.origem}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Loja Destino</Label>
                <p className="font-medium">{storeTransferDetail.destino}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data da Transferência</Label>
                <p className="font-medium">
                  {date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(date, { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Movement Details */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Saída (Origin) */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-red-900">Movimento de Saída (Origem)</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground text-xs">Quantidade</Label>
                    <p className="font-mono text-lg font-semibold text-red-700">
                      {storeTransferDetail.movimentoSaida.quantidade.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Valor Unitário</Label>
                    <p className="font-mono font-medium">
                      R$ {storeTransferDetail.movimentoSaida.valorUnitario.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Valor Total</Label>
                    <p className="font-mono font-bold text-lg text-red-700">
                      R$ {storeTransferDetail.movimentoSaida.valorTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Entrada (Destination) */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-green-900">Movimento de Entrada (Destino)</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground text-xs">Quantidade</Label>
                    <p className="font-mono text-lg font-semibold text-green-700">
                      {storeTransferDetail.movimentoEntrada.quantidade.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Valor Unitário</Label>
                    <p className="font-mono font-medium">
                      R$ {storeTransferDetail.movimentoEntrada.valorUnitario.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Valor Total</Label>
                    <p className="font-mono font-bold text-lg text-green-700">
                      R$ {storeTransferDetail.movimentoEntrada.valorTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Product ID */}
            <div>
              <Label className="text-muted-foreground">ID do Produto</Label>
              <p className="font-mono text-sm">{storeTransferDetail.produtoId}</p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Não foi possível carregar os detalhes.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}