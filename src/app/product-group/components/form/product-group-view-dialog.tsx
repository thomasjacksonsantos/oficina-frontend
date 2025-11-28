'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProductGroupContext } from '../list/product-group-context';

export default function ProductGroupViewDialog() {
  const { viewingProductGroup, setViewingProductGroup } = useProductGroupContext();

  if (!viewingProductGroup) return null;

  return (
    <Dialog open={!!viewingProductGroup} onOpenChange={() => setViewingProductGroup(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Grupo de Produto</DialogTitle>
        </DialogHeader>
        
        <Separator />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p className="font-medium">{viewingProductGroup.descricao}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Área</Label>
              <p className="font-medium">{viewingProductGroup.area}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">NCM</Label>
              <p className="font-medium font-mono">{viewingProductGroup.ncm}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">ANP</Label>
              <p className="font-medium font-mono">{viewingProductGroup.anp}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="font-medium">{viewingProductGroup.status || 'Ativo'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
