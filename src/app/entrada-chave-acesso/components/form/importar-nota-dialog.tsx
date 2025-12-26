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
import { Badge } from '@/components/ui/badge';
import { IconCircleCheckFilled } from '@tabler/icons-react';
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
  const [validationErrors, setValidationErrors] = useState<string[] | null>(null);

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

    const produto = newProdutos[index];

    // Current unit price and quantity
    const valorUnitarioNum = Number(produto.valorUnitario ?? 0);
    const quantidadeNum = Number(produto.quantidade ?? 0);

    // If the user changed valorVenda, accept the raw input string so the user can type freely
    if (field === 'valorVenda') {
      // keep raw string until blur so the user can type using comma as decimal separator
      newProdutos[index].valorVenda = value as any;
    }

    // Recalculate valorTotal when unit price or quantity changes
    if (field === 'valorUnitario' || field === 'quantidade') {
      const valorUnitario = Number(newProdutos[index].valorUnitario ?? 0);
      const quantidade = Number(newProdutos[index].quantidade ?? 0);
      newProdutos[index].valorTotal = Number((valorUnitario * quantidade).toFixed(2));

      // If there is already a valorVenda, ensure it's not below updated unit price
      const rawVendaExisting = newProdutos[index].valorVenda;
      const currentVenda =
        typeof rawVendaExisting === 'string'
          ? Number(String(rawVendaExisting).replace(',', '.'))
          : Number(rawVendaExisting ?? 0);

      if (!isNaN(currentVenda) && currentVenda < valorUnitario) {
        newProdutos[index].valorVenda = Number(valorUnitario.toFixed(2));
      }
    }

    // Auto-calculate markup when valorVenda or valorUnitario (or quantity) changes
    if (field === 'valorVenda' || field === 'valorUnitario' || field === 'quantidade') {
      // Parse valorVenda whether it's string or number, accept comma as decimal separator
      const rawVenda = newProdutos[index].valorVenda;
      const valorVenda =
        typeof rawVenda === 'string'
          ? Number(String(rawVenda).replace(',', '.'))
          : Number(rawVenda ?? 0);
      const valorUnitario = Number(newProdutos[index].valorUnitario ?? 0);

      let markup = 0;

      // Avoid division by zero and non-finite values
      if (!isFinite(valorVenda) || !isFinite(valorUnitario) || valorUnitario === 0) {
        markup = 0;
      } else {
        // Use unit price as base: ((Venda - Custo) / Custo) * 100
        markup = ((valorVenda - valorUnitario) / valorUnitario) * 100;
      }

      newProdutos[index].markup = Number(markup.toFixed(2));
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
        // Accept string with comma as decimal separator when sending to API
        valorVenda: Number(String(produto.valorVenda ?? 0).replace(',', '.')),
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
          const errorData = error.response?.data;

          // If the API returned structured validation errors, show them in an alert and toast
          if (errorData?.errors) {
            // Flatten messages into a list
            const messages: string[] = [];
            Object.entries(errorData.errors).forEach(([field, msgs]) => {
              if (Array.isArray(msgs) && msgs.length) {
                msgs.forEach((m) => messages.push(`${field}: ${m}`));
              } else if (typeof msgs === 'string') {
                messages.push(`${field}: ${msgs}`);
              }
            });

            if (messages.length) {
              setValidationErrors(messages);
              toast.error('Erro de validação nos dados');
              return;
            }
          }

          const errorMessage = errorData?.message || 'Erro ao salvar produtos';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleClose = () => {
    setViewingNotaFiscal(null);
    setImportingNotaFiscal(null);
    setProdutos([]);
    setValidationErrors(null);
  };

  if (!viewingNotaFiscal) return null;

  const { dadosNotaFiscal, calculoImpostos } = viewingNotaFiscal;

  return (
    <Dialog open={!!viewingNotaFiscal} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-[98vw] sm:max-w-[95vw] lg:max-w-7xl h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] max-h-[98vh] sm:max-h-[95vh] p-3 sm:p-4 md:p-6 overflow-hidden flex flex-col bg-card">
        <DialogHeader className="space-y-1 sm:space-y-2 flex-shrink-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-base sm:text-lg md:text-xl">
              Importar Nota Fiscal
            </DialogTitle>

            {importingNotaFiscal?.notaFiscalStatus && (
              <Badge
                variant="outline"
                className="text-muted-foreground px-2 flex items-center gap-2"
              >
                {importingNotaFiscal.notaFiscalStatus.key === 'Importado' ? (
                  <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                ) : (
                  <IconCircleCheckFilled className="fill-yellow-500 dark:fill-yellow-400" />
                )}
                {importingNotaFiscal.notaFiscalStatus.nome}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Separator className="my-2 sm:my-3 md:my-4 flex-shrink-0" />

        {validationErrors && validationErrors.length > 0 && (
          <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-3">
            <div className="text-sm font-semibold text-red-700">Erros de validação</div>
            <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
              {validationErrors.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 md:space-y-6 px-1">
          {/* Top Section - N. Nota, Natureza da Operação, Chave de acesso */}
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">N. Nota</Label>
              <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                <span className="text-xs sm:text-sm break-all">{dadosNotaFiscal.numeroNota}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Natureza da Operação</Label>
              <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                <span className="text-xs sm:text-sm break-words">
                  {dadosNotaFiscal.naturezaOperacao}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
              <Label className="text-xs text-muted-foreground">Chave de acesso</Label>
              <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                <span className="text-[10px] sm:text-xs md:text-sm font-mono break-all">
                  {dadosNotaFiscal.chaveAcesso}
                </span>
              </div>
            </div>
          </div>

          <Separator className="hidden sm:block" />

          {/* Destinatário e CPF/CNPJ */}
          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Destinatário</Label>
              <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                <span className="text-xs sm:text-sm break-words">
                  {dadosNotaFiscal.destinatario.razaoSocial || '-'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">CPF/CNPJ</Label>
              <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                <span className="text-xs sm:text-sm">
                  {dadosNotaFiscal.destinatario.documento
                    ? formatCpfCnpj(dadosNotaFiscal.destinatario.documento)
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <Separator className="hidden sm:block" />

          {/* Emitente Section */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold">Emitente</h3>

            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Razão Social</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm break-words">
                    {dadosNotaFiscal.emitente.razaoSocial}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">CPF/CNPJ</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {formatCpfCnpj(dadosNotaFiscal.emitente.documento)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Data de Emissão</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {new Date(dadosNotaFiscal.dataEmissao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Data de Saída/Entrada</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {new Date(dadosNotaFiscal.dataSaida).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Endereço</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm break-words">
                    {dadosNotaFiscal.emitente.logradouro ||
                      dadosNotaFiscal.emitente.endereco ||
                      '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Número</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {dadosNotaFiscal.emitente.numero || '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Bairro</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm break-words">
                    {dadosNotaFiscal.emitente.bairro}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Cep</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {formatCep(dadosNotaFiscal.emitente.cep)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Município</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm break-words">
                    {dadosNotaFiscal.emitente.municipio}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">UF</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">{dadosNotaFiscal.emitente.uf}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Telefone</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {dadosNotaFiscal.emitente.telefone
                      ? formatPhone(dadosNotaFiscal.emitente.telefone)
                      : '-'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Ins. Estadual</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm break-all">
                    {dadosNotaFiscal.emitente.inscricaoEstadual || '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Hora de Saída/Entrada</Label>
              <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                <span className="text-xs sm:text-sm">
                  {new Date(dadosNotaFiscal.horaSaida).toLocaleTimeString('pt-BR')}
                </span>
              </div>
            </div>

            {dadosNotaFiscal.informacoesComplementares && (
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Informações complementares</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30 min-h-[60px]">
                  <span className="text-xs sm:text-sm break-words">
                    {dadosNotaFiscal.informacoesComplementares}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator className="hidden sm:block" />

          {/* Tax Calculations Section */}
          <div className="space-y-2 sm:space-y-3">
            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Base Cálculo ICMS</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.baseCalculoICMS.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor ICMS</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.valorICMS.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Base Cálculo ICMS ST</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.baseCalculoICMSST.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor ICMS Subs</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.valorICMSSub.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor Frete</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.valorFrete.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor Seguro</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.valorSeguro.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Desconto</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.desconto.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Outras Despesas</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.outrasDespesas.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Valor IPI</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.valorIPI.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Total Impostos</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.valorTotalImpostos.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">Total Produtos</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm">
                    {calculoImpostos.valorTotalProdutos.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground font-semibold">Total Nota</Label>
                <div className="border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30">
                  <span className="text-xs sm:text-sm font-semibold">
                    {calculoImpostos.valorTotalNotaFiscal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="hidden sm:block" />

          {/* Products Table - FULLY RESPONSIVE WITH HORIZONTAL SCROLL */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-muted-foreground italic">
                Preencha o preço de venda para calcular o markup
              </span>
            </div>

            {/* Scrollable Table Container */}
            <div
              className="border rounded-lg overflow-x-auto -mx-1 sm:mx-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-muted sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[80px]">
                        Ref
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[150px]">
                        Descrição
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[100px]">
                        Grupo
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[80px]">
                        Unidade
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[70px]">
                        Qtd Ent
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[70px]">
                        Unit.
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[70px]">
                        Total
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[60px]">
                        Frete
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[60px]">
                        Desc
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[60px]">
                        Imp
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[80px] bg-green-50 dark:bg-green-950/20">
                        Venda
                      </th>
                      <th className="text-left p-1.5 sm:p-2 font-semibold text-[10px] sm:text-xs whitespace-nowrap min-w-[60px] bg-green-50 dark:bg-green-950/20">
                        Markup
                      </th>
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
                          <td className="p-1 sm:p-2">
                            <Input
                              value={produto.codigo}
                              onChange={(e) => handleProdutoChange(index, 'codigo', e.target.value)}
                              className="h-7 sm:h-8 text-[10px] sm:text-xs w-full min-w-[80px]"
                            />
                          </td>
                          <td className="p-1 sm:p-2">
                            <Input
                              value={produto.descricao}
                              onChange={(e) =>
                                handleProdutoChange(index, 'descricao', e.target.value)
                              }
                              className="h-7 sm:h-8 text-[10px] sm:text-xs w-full min-w-[150px]"
                            />
                          </td>
                          <td className="p-1 sm:p-2">
                            <Select
                              value={produto.grupoProdutoId}
                              onValueChange={(value) =>
                                handleProdutoChange(index, 'grupoProdutoId', value)
                              }
                            >
                              <SelectTrigger className="h-7 sm:h-8 text-[10px] sm:text-xs w-full min-w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {gruposProdutos?.dados.map((grupo) => (
                                  <SelectItem key={grupo.id} value={grupo.id}>
                                    {grupo.descricao}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-1 sm:p-2">
                            <Select
                              value={produto.unidadeProdutoId}
                              onValueChange={(value) =>
                                handleProdutoChange(index, 'unidadeProdutoId', value)
                              }
                            >
                              <SelectTrigger className="h-7 sm:h-8 text-[10px] sm:text-xs w-full min-w-[80px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {unidadesProdutos?.dados?.map((unidade) => (
                                  <SelectItem key={unidade.id} value={unidade.id}>
                                    {unidade.descricao}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-1 sm:p-2">
                            <Input
                              type="text"
                              step="0,01"
                              value={quantidadeNum}
                              onChange={(e) =>
                                handleProdutoChange(index, 'quantidade', parseFloat(e.target.value))
                              }
                              className="h-7 sm:h-8 text-[10px] sm:text-xs w-[70px]"
                              title="Qtd entrada"
                            />
                          </td>
                          <td className="p-1 sm:p-2">
                            <span className="text-[10px] sm:text-xs whitespace-nowrap">
                              {valorUnitarioNum.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="p-1 sm:p-2">
                            <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">
                              {valorTotalNum.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="p-1 sm:p-2">
                            <span className="text-[10px] sm:text-xs whitespace-nowrap">
                              {freteDespesasNum.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="p-1 sm:p-2">
                            <span className="text-[10px] sm:text-xs whitespace-nowrap">
                              {descontoNum.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="p-1 sm:p-2">
                            <span className="text-[10px] sm:text-xs whitespace-nowrap">
                              {impostoNum.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                          <td className="p-1 sm:p-2 bg-green-50/50 dark:bg-green-950/10">
                            <Input
                              type="text"
                              step="0,01"
                              value={
                                produto.valorVenda !== undefined && produto.valorVenda !== null
                                  ? typeof produto.valorVenda === 'number'
                                    ? produto.valorVenda.toFixed(2).replace('.', ',')
                                    : String(produto.valorVenda).replace('.', ',')
                                  : ''
                              }
                              onChange={(e) =>
                                handleProdutoChange(index, 'valorVenda', e.target.value)
                              }
                              onBlur={() => {
                                // Validate and format on blur. Accept comma as decimal separator.
                                const current = produtos[index]?.valorVenda;
                                const parsed = Number(String(current ?? '').replace(',', '.'));
                                const unit = Number(produtos[index]?.valorUnitario ?? 0);
                                let final = isFinite(parsed) ? parsed : unit;
                                if (final < unit) final = unit;
                                const newProdutos = [...produtos];
                                newProdutos[index] = {
                                  ...newProdutos[index],
                                  valorVenda: Number(final.toFixed(2)),
                                };

                                // Recompute markup
                                const valorUnitario = Number(newProdutos[index].valorUnitario ?? 0);
                                let markup = 0;
                                if (
                                  isFinite(final) &&
                                  isFinite(valorUnitario) &&
                                  valorUnitario !== 0
                                ) {
                                  markup = ((final - valorUnitario) / valorUnitario) * 100;
                                }
                                newProdutos[index].markup = Number(markup.toFixed(2));
                                setProdutos(newProdutos);
                              }}
                              className="h-7 sm:h-8 text-[10px] sm:text-xs w-[80px]"
                              placeholder="0,00"
                              title="Preço venda"
                            />
                          </td>
                          <td className="p-1 sm:p-2 bg-green-50/50 dark:bg-green-950/10">
                            <span className="text-[10px] sm:text-xs font-medium text-green-600 whitespace-nowrap">
                              {markupNum ? `${markupNum.toFixed(2)}%` : '0%'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scroll hint for mobile */}
            <p className="text-[10px] text-muted-foreground text-center sm:hidden">
              ← Deslize horizontalmente para ver todas as colunas →
            </p>
          </div>
        </div>

        <DialogFooter className="mt-3 sm:mt-4 md:mt-6 flex-col sm:flex-row gap-2 flex-shrink-0">
          <Button
            variant="outline"
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
          >
            Voltar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={isPending || importingNotaFiscal?.notaFiscalStatus.key == 'Importado'}
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
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
