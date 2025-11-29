'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSupplierContext } from '../list/supplier-context';

export default function SupplierViewDialog() {
  const { viewingSupplier, setViewingSupplier } = useSupplierContext();

  if (!viewingSupplier) return null;

  return (
    <Dialog open={!!viewingSupplier} onOpenChange={() => setViewingSupplier(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Fornecedor</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Informações Básicas</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">Nome Fantasia</Label>
                <p className="font-medium">{viewingSupplier.nomeFantasia}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Razão Social</Label>
                <p className="font-medium">{viewingSupplier.razaoSocial}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CPF/CNPJ</Label>
                <p className="font-medium">{viewingSupplier.documento}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Data de Abertura</Label>
                <p className="font-medium">
                  {new Date(viewingSupplier.dataNascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">I.E</Label>
                <p className="font-medium">{viewingSupplier.inscricaoEstadual || '-'}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Contato</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{viewingSupplier.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Site</Label>
                <p className="font-medium">{viewingSupplier.site || '-'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Telefones</Label>
              {viewingSupplier.contatos.map((contato: any, index: any) => (
                <div key={index} className="flex gap-2">
                  <p className="font-medium">{contato.tipoTelefone}:</p>
                  <p>{contato.numero}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Endereço</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">CEP</Label>
                <p className="font-medium">{viewingSupplier.endereco.cep}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">Logradouro</Label>
                <p className="font-medium">{viewingSupplier.endereco.logradouro}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">Número</Label>
                <p className="font-medium">{viewingSupplier.endereco.numero}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-muted-foreground">Complemento</Label>
                <p className="font-medium">{viewingSupplier.endereco.complemento || '-'}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-muted-foreground">Bairro</Label>
                <p className="font-medium">{viewingSupplier.endereco.bairro}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cidade</Label>
                <p className="font-medium">{viewingSupplier.endereco.cidade}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Estado</Label>
                <p className="font-medium">{viewingSupplier.endereco.estado}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Informações Fiscais</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Inscrição Municipal</Label>
                <p className="font-medium">{viewingSupplier.inscricaoMunicipal || '-'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo Consumidor</Label>
                <p className="font-medium">{viewingSupplier.tipoConsumidor}</p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Indicador de I.E</Label>
              <p className="font-medium">{viewingSupplier.indicadorIE}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
