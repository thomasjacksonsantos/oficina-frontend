'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProductContext } from '../list/product-context';

export default function ProductViewDialog() {
  const { viewingProduct, setViewingProduct } = useProductContext();

  if (!viewingProduct) return null;

  return (
    <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Informações Básicas</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Referência</Label>
                <p className="font-medium">{viewingProduct.referencia}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">NCM</Label>
                <p className="font-medium">{viewingProduct.ncm || '-'}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p className="font-medium">{viewingProduct.descricao || '-'}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Grupo</Label>
                <p className="font-medium">{viewingProduct.grupoProduto}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="font-medium">{viewingProduct.unidadeProduto}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium">
                  {viewingProduct.produtoStatus?.nome || viewingProduct.produtoStatus?.key || '-'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Origem da Mercadoria</Label>
                <p className="font-medium">{viewingProduct.origemMercadoria || '-'}</p>
              </div>
            </div>

            {viewingProduct.observacao && (
              <div>
                <Label className="text-muted-foreground">Observação</Label>
                <p className="font-medium whitespace-pre-wrap">{viewingProduct.observacao}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Data de Criação</Label>
                <p className="font-medium">
                  {new Date(viewingProduct.creado).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Última Atualização</Label>
                <p className="font-medium">
                  {new Date(viewingProduct.actualizado).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
