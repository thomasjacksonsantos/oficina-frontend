'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProductContext } from '../list/product-context';
import { Badge } from '@/components/ui/badge';

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
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Referência</Label>
                <p className="font-medium font-mono">{viewingProduct.referencia}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Código de Barras</Label>
                <p className="font-medium">{viewingProduct.codigoBarra}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Descrição</Label>
              <p className="font-medium">{viewingProduct.descricao}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Aplicação</Label>
              <p className="font-medium text-sm leading-relaxed">
                {viewingProduct.aplicacao}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Marca</Label>
                <p className="font-medium">{viewingProduct.marca}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Grupo</Label>
                <p className="font-medium">{viewingProduct.grupo || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados Complementares */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dados Complementares</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Fornecedor</Label>
                <p className="font-medium">{viewingProduct.dadosComplementares.fornecedor}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Endereço</Label>
                <p className="font-medium">{viewingProduct.dadosComplementares.endereco}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">Estoque</Label>
                <p className="font-medium">{viewingProduct.dadosComplementares.estoque}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo Unidade</Label>
                <p className="font-medium">{viewingProduct.dadosComplementares.tipoUnidade}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant="outline">
                  {viewingProduct.dadosComplementares.statusProduto}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Preços */}
          <div className="space-y-4">
            <h3 className="font-semibold">Valores</h3>
            
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label className="text-muted-foreground">Compra</Label>
                <p className="font-medium">R$ {viewingProduct.preco.compra.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Venda</Label>
                <p className="font-medium">R$ {viewingProduct.preco.venda.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Custo</Label>
                <p className="font-medium">R$ {viewingProduct.preco.custo.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Compra Fixo</Label>
                <p className="font-medium">R$ {viewingProduct.preco.compraFixo.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label className="text-muted-foreground">Data Compra</Label>
                <p className="font-medium text-sm">
                  {new Date(viewingProduct.preco.dataCompra).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data Venda</Label>
                <p className="font-medium text-sm">
                  {new Date(viewingProduct.preco.dataVenda).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data Custo</Label>
                <p className="font-medium text-sm">
                  {new Date(viewingProduct.preco.dataCusto).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data Compra Fixo</Label>
                <p className="font-medium text-sm">
                  {new Date(viewingProduct.preco.dataCompraFixo).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados Fiscais */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dados Fiscais</h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">Origem Mercadoria</Label>
                <p className="font-medium">{viewingProduct.dadosFiscalProduto.origemMercadoria}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">NCM</Label>
                <p className="font-medium">{viewingProduct.dadosFiscalProduto.NCM}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">ANP</Label>
                <p className="font-medium">{viewingProduct.dadosFiscalProduto.ANP}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Regra Específica</Label>
              <p className="font-medium">
                {viewingProduct.dadosFiscalProduto.regraEspecificaParaEsteItem || 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Markup */}
          <div className="space-y-4">
            <h3 className="font-semibold">Markup</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Produto</Label>
                <p className="font-medium">{viewingProduct.markup.produto}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Grupo</Label>
                <p className="font-medium">{viewingProduct.markup.grupo}%</p>
              </div>
            </div>
          </div>

          {viewingProduct.observacao && (
            <>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Observações</Label>
                <p className="font-medium text-sm leading-relaxed mt-2">
                  {viewingProduct.observacao}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}