// app/stock-correction/components/forms/stock-correction-view-dialog.tsx

'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStockCorrectionContext } from '../list/stock-correction-context';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function StockCorrectionViewDialog() {
  const { viewingStockCorrection, setViewingStockCorrection } = useStockCorrectionContext();

  if (!viewingStockCorrection) return null;

  const date = new Date(viewingStockCorrection.data);
  const valorTotal = viewingStockCorrection.quantidade * viewingStockCorrection.valorUnitario;

  return (
    <Dialog open={!!viewingStockCorrection} onOpenChange={() => setViewingStockCorrection(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Correção de Estoque</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Produto</Label>
              <p className="font-medium text-lg">{viewingStockCorrection.descricao}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">ID do Produto</Label>
              <p className="font-mono text-sm">{viewingStockCorrection.produtoId}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Data do Movimento</Label>
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

          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h4 className="font-semibold">Movimentação de Estoque</h4>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground text-xs">Quantidade Anterior</Label>
                <p className="font-mono text-lg">
                  {viewingStockCorrection.quantidadeAntes.toFixed(2)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Quantidade Movimentada</Label>
                <p className="font-mono text-lg font-semibold text-blue-600">
                  {viewingStockCorrection.quantidade.toFixed(2)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Quantidade Final</Label>
                <p className="font-mono text-lg font-bold text-green-600">
                  {viewingStockCorrection.quantidadeDiferenca.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Valor Unitário</Label>
              <p className="font-mono font-medium">
                R$ {viewingStockCorrection.valorUnitario.toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Quantidade</Label>
              <p className="font-mono font-medium">
                {viewingStockCorrection.quantidade.toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Valor Total</Label>
              <p className="font-mono font-bold text-lg">R$ {valorTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
