// app/entrada-chave-acesso/components/form/importar-nota-dialog.tsx

'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useEntradaContext } from '../list/entrada-context';
import {
  useUpsertProdutos,
  useGetGruposProdutos,
  useGetUnidadesProdutos,
  useGetNotaFiscal,
} from '@/app/entrada-chave-acesso/api';
import { Loader2 } from 'lucide-react';
import { Input, FloatingInput } from '@/components/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ItemNotaFiscal } from '@/api/entrada-chave-acesso.types';
import { formatCpfCnpj } from '@/helpers/formatCpfCnpj';
import { formatPhone } from '@/helpers/formatPhone';
import { formatCep } from '@/helpers/formatCep';

export default function ImportarNotaDialog() {
  const { viewingNotaFiscal, importingNotaFiscal, setViewingNotaFiscal, setImportingNotaFiscal } =
    useEntradaContext();
  const [lojaId] = useState('uk');
  const [produtos, setProdutos] = useState<ItemNotaFiscal[]>([]);

  const { mutate: upsertProdutos, isPending } = useUpsertProdutos();
  const { data: gruposProdutos } = useGetGruposProdutos();
  const { data: unidadesProdutos } = useGetUnidadesProdutos();
  const { mutate: getNotaFiscal } = useGetNotaFiscal();

  // When importingNotaFiscal changes, fetch full details
  useEffect(() => {
    if (importingNotaFiscal?.id && !viewingNotaFiscal) {
      getNotaFiscal(importingNotaFiscal.id, {
        onSuccess: (data) => {
          setViewingNotaFiscal(data);
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Erro ao buscar nota fiscal';
          toast.error(errorMessage);
          setImportingNotaFiscal(null);
        },
      });
    }
  }, [
    importingNotaFiscal,
    viewingNotaFiscal,
    getNotaFiscal,
    setViewingNotaFiscal,
    setImportingNotaFiscal,
  ]);

  // Initialize produtos when nota fiscal is loaded
  useEffect(() => {
    if (viewingNotaFiscal?.itens) {
      setProdutos(
        viewingNotaFiscal.itens.map((item) => ({
          ...item,
          markup: item.markup || 0,
          valorVenda: item.valorVenda || 0,
        }))
      );
    }
  }, [viewingNotaFiscal]);

  const handleProdutoChange = (index: number, field: keyof ItemNotaFiscal, value: any) => {
    const newProdutos = [...produtos];
    newProdutos[index] = {
      ...newProdutos[index],
      [field]: value,
    };

    // Auto-calculate markup when valorVenda or valorUnitario changes
    if (field === 'valorVenda' || field === 'valorUnitario') {
      const produto = newProdutos[index];
      const valorVenda = field === 'valorVenda' ? Number(value) : Number(produto.valorVenda || 0);
      const valorUnitario =
        field === 'valorUnitario' ? Number(value) : Number(produto.valorUnitario);

      if (valorVenda > 0 && valorUnitario > 0) {
        // Formula: ((ValorVenda - ValorUnitario) / ValorVenda) × 100
        const markup = ((valorVenda - valorUnitario) / valorVenda) * 100;
        newProdutos[index].markup = Number(markup.toFixed(2));
      }
    }

    setProdutos(newProdutos);
  };

  const handleSalvar = async () => {
    if (!viewingNotaFiscal) {
      toast.error('Dados da nota fiscal não encontrados');
      return;
    }

    const payload = {
      lojaId: lojaId.toLowerCase(),
      chaveAcesso: viewingNotaFiscal.dadosNotaFiscal.chaveAcesso,
      fornecedor: {
        cnpj: viewingNotaFiscal.dadosNotaFiscal.emitente.documento,
        razaoSocial: viewingNotaFiscal.dadosNotaFiscal.emitente.razaoSocial,
        nomeFantasia: viewingNotaFiscal.dadosNotaFiscal.emitente.nome,
      },
      produtos: produtos.map((produto) => ({
        codigo: produto.codigo,
        descricao: produto.descricao,
        descricaoNotaFiscal: produto.descricaoNotaFiscal || produto.descricao || '',
        grupoProdutoId: produto.grupoProdutoId,
        unidadeProdutoId: produto.unidadeProdutoId,
        origemMercadoria: produto.origemMercadoria,
        ncm: produto.ncm,
        valorUnitario: Number(produto.valorUnitario),
        quantidade: Number(produto.quantidade),
        valorTotal: Number(
          produto.valorTotal ?? Number(produto.valorUnitario || 0) * Number(produto.quantidade || 0)
        ),
        freteDespesas: Number(produto.freteDespesas ?? 0),
        desconto: Number(produto.desconto ?? 0),
        imposto: Number(produto.imposto ?? 0),
        valorICMSST: Number(produto.valorICMSST ?? 0),
        valorIPI: Number(produto.valorIPI ?? 0),
        markup: Number(produto.markup ?? 0),
        valorVenda: Number(produto.valorVenda ?? 0),
      })),
    };

    upsertProdutos(
      { lojaId: lojaId.toLowerCase(), input: payload },
      {
        onSuccess: () => {
          toast.success('Produtos salvos com sucesso!');
          handleClose();
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Erro ao salvar produtos';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleClose = () => {
    setViewingNotaFiscal(null);
    setImportingNotaFiscal(null);
    setProdutos([]);
  };

  if (!viewingNotaFiscal) return null;

  const { dadosNotaFiscal, calculoImpostos } = viewingNotaFiscal;

  return (
    <Dialog open={!!viewingNotaFiscal} onOpenChange={handleClose}>
      <DialogContent className="sm:max max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Nota Fiscal</DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Top Section - N. Nota, Natureza da Operação, Chave de acesso */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">N. Nota</Label>
              <div className="border rounded-md px-3 py-2 bg-muted/30">
                <span className="text-sm">{dadosNotaFiscal.numeroNota}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Natureza da Operação</Label>
              <div className="border rounded-md px-3 py-2 bg-muted/30">
                <span className="text-sm">{dadosNotaFiscal.naturezaOperacao}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Chave de acesso</Label>
              <div className="border rounded-md px-3 py-2 bg-muted/30">
                <span className="text-sm font-mono text-xs">{dadosNotaFiscal.chaveAcesso}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Destinatário e CPF/CNPJ */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Destinatário</Label>
              <div className="border rounded-md px-3 py-2 bg-muted/30">
                <span className="text-sm">{dadosNotaFiscal.destinatario.razaoSocial || '-'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">CPF/CNPJ</Label>
              <div className="border rounded-md px-3 py-2 bg-muted/30">
                <span className="text-sm">
                  {dadosNotaFiscal.destinatario.documento
                    ? formatCpfCnpj(dadosNotaFiscal.destinatario.documento)
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Emitente Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Emitente</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Razão Social</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">{dadosNotaFiscal.emitente.razaoSocial}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">CPF/CNPJ</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {formatCpfCnpj(dadosNotaFiscal.emitente.documento)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Data de Emissão</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {new Date(dadosNotaFiscal.dataEmissao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Data de Saída/Entrada</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {new Date(dadosNotaFiscal.dataSaida).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Endereço</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {dadosNotaFiscal.emitente.logradouro ||
                      dadosNotaFiscal.emitente.endereco ||
                      '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Número</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">{dadosNotaFiscal.emitente.numero || '-'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Bairro</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">{dadosNotaFiscal.emitente.bairro}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Cep</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">{formatCep(dadosNotaFiscal.emitente.cep)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Município</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">{dadosNotaFiscal.emitente.municipio}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">UF</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">{dadosNotaFiscal.emitente.uf}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Telefone</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {dadosNotaFiscal.emitente.telefone
                      ? formatPhone(dadosNotaFiscal.emitente.telefone)
                      : '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Ins. Estadual</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {dadosNotaFiscal.emitente.inscricaoEstadual || '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Hora de Saída/Entrada</Label>
              <div className="border rounded-md px-3 py-2 bg-muted/30">
                <span className="text-sm">
                  {new Date(dadosNotaFiscal.horaSaida).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>

            {dadosNotaFiscal.informacoesComplementares && (
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Informações complementares</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30 min-h-[60px]">
                  <span className="text-sm">{dadosNotaFiscal.informacoesComplementares}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Tax Calculations Section */}
          <div className="space-y-3">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Base de Cálculo ICMS</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.baseCalculoICMS.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor ICMS</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.valorICMS.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Base de Cálculo ICMS ST</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.baseCalculoICMSST.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor do ICMS Subs</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.valorICMSSub.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor do Frete</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.valorFrete.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor do Seguro</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.valorSeguro.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Desconto</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.desconto.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Outras Despesas</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.outrasDespesas.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor IPI</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.valorIPI.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor Total dos Impostos</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.valorTotalImpostos.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor Total dos Produtos</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm">
                    {calculoImpostos.valorTotalProdutos.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor Total da Nota</Label>
                <div className="border rounded-md px-3 py-2 bg-muted/30">
                  <span className="text-sm font-semibold">
                    {calculoImpostos.valorTotalNotaFiscal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Products Table with NEW COLUMNS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground italic">
                Preencha o preço de venda para calcular o markup automaticamente
              </span>
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 font-semibold text-xs">Referência</th>
                    <th className="text-left p-2 font-semibold text-xs">Descrição</th>
                    <th className="text-left p-2 font-semibold text-xs">Grupo de Produto</th>
                    <th className="text-left p-2 font-semibold text-xs">Tipo Unidade</th>
                    <th className="text-left p-2 font-semibold text-xs">Qtd</th>
                    <th className="text-left p-2 font-semibold text-xs">Qtd Entrada</th>
                    <th className="text-left p-2 font-semibold text-xs">Unitário</th>
                    <th className="text-left p-2 font-semibold text-xs">Total</th>
                    <th className="text-left p-2 font-semibold text-xs">Frete</th>
                    <th className="text-left p-2 font-semibold text-xs">Desconto</th>
                    <th className="text-left p-2 font-semibold text-xs">Imposto</th>
                    <th className="text-left p-2 font-semibold text-xs">Venda</th>
                    <th className="text-left p-2 font-semibold text-xs">Markup</th>
                    <th className="text-left p-2 font-semibold text-xs">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto, index) => {
                    const valorUnitarioNum = Number(produto.valorUnitario || 0);
                    const valorTotalNum = Number(produto.valorTotal || 0);
                    const freteDespesasNum = Number(produto.freteDespesas || 0);
                    const descontoNum = Number(produto.desconto || 0);
                    const impostoNum = Number(produto.imposto || 0);
                    const quantidadeNum = Number(produto.quantidade || 0);
                    const valorVendaNum = Number(produto.valorVenda || 0);
                    const markupNum = Number(produto.markup || 0);

                    return (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        {/* Referência - Editable */}
                        <td className="p-2">
                          <Input
                            value={produto.codigo}
                            onChange={(e) => handleProdutoChange(index, 'codigo', e.target.value)}
                            className="h-8 text-xs min-w-[100px]"
                          />
                        </td>

                        {/* Descrição - Editable */}
                        <td className="p-2">
                          <Input
                            value={produto.descricao}
                            onChange={(e) =>
                              handleProdutoChange(index, 'descricao', e.target.value)
                            }
                            className="h-8 text-xs min-w-[200px]"
                          />
                        </td>

                        {/* Grupo de Produto - Dropdown */}
                        <td className="p-2">
                          <Select
                            value={produto.grupoProdutoId}
                            onValueChange={(value) =>
                              handleProdutoChange(index, 'grupoProdutoId', value)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs min-w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {gruposProdutos?.dados.map((grupo) => (
                                <SelectItem key={grupo.id} value={grupo.id}>
                                  {grupo.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        {/* Tipo Unidade - Dropdown */}
                        <td className="p-2">
                          <Select
                            value={produto.unidadeProdutoId}
                            onValueChange={(value) =>
                              handleProdutoChange(index, 'unidadeProdutoId', value)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs min-w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {unidadesProdutos?.dados?.map((unidade) => (
                                <SelectItem key={unidade.id} value={unidade.id}>
                                  {unidade.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>

                        {/* Qtd - Editable */}
                        <td className="p-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={quantidadeNum}
                            onChange={(e) =>
                              handleProdutoChange(index, 'quantidade', parseFloat(e.target.value))
                            }
                            className="h-8 text-xs w-20"
                          />
                        </td>

                        {/* Qtd Entrada - Editable (NEW) */}
                        <td className="p-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={quantidadeNum}
                            onChange={(e) =>
                              handleProdutoChange(index, 'quantidade', parseFloat(e.target.value))
                            }
                            className="h-8 text-xs w-20"
                            title="Quantidade da entrada - pode ser alterada"
                          />
                        </td>

                        {/* Unitário - Read-only (CHANGED) */}
                        <td className="p-2">
                          <span className="text-xs">
                            {valorUnitarioNum.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </td>

                        {/* Total - Read-only */}
                        <td className="p-2">
                          <span className="text-xs font-medium">
                            {valorTotalNum.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </td>

                        {/* Frete - Read-only */}
                        <td className="p-2">
                          <span className="text-xs">
                            {freteDespesasNum.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </td>

                        {/* Desconto - Read-only */}
                        <td className="p-2">
                          <span className="text-xs">
                            {descontoNum.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </td>

                        {/* Imposto - Read-only */}
                        <td className="p-2">
                          <span className="text-xs">
                            {impostoNum.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </td>

                        {/* Venda - Editable (NEW) */}
                        <td className="p-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={valorVendaNum || ''}
                            onChange={(e) =>
                              handleProdutoChange(
                                index,
                                'valorVenda',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="h-8 text-xs w-24"
                            placeholder="Preço venda"
                            title="Preço de venda - preencha este valor"
                          />
                        </td>

                        {/* Markup - Auto-calculated (CHANGED) */}
                        <td className="p-2">
                          <span className="text-xs font-medium text-green-600">
                            {markupNum ? `${markupNum.toFixed(2)}%` : '0.00%'}
                          </span>
                        </td>

                        {/* Ações - Delete button */}
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const newProdutos = produtos.filter((_, i) => i !== index);
                              setProdutos(newProdutos);
                            }}
                          >
                            ×
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" type="button" onClick={handleClose} disabled={isPending}>
            Voltar
          </Button>
          <Button onClick={handleSalvar} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
