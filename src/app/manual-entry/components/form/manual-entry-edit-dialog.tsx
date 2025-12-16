// manual-entry-edit-dialog.tsx
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { manualEntrySchema, type CreateManualEntrySchema } from './manual-entry.schema';
import { toast } from 'sonner';
import { useManualEntryContext } from '../list/manual-entry-context';
import { useUpdateManualEntry } from '@/app/manual-entry/api';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualEntryProductInput } from '@/api/manual-entry.types';

export default function ManualEntryEditDialog() {
  const { editingEntry, setEditingEntry } = useManualEntryContext();
  const { mutate: updateEntry, isPending } = useUpdateManualEntry();
  const [produtos, setProdutos] = React.useState<ManualEntryProductInput[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateManualEntrySchema>({
    resolver: zodResolver(manualEntrySchema),
  });

  React.useEffect(() => {
    if (editingEntry) {
      reset({
        codigo: editingEntry.codigo || '',
        data: editingEntry.data || '',
        nfRevenda: editingEntry.nfRevenda as any,
        fornecedor: editingEntry.fornecedor || { id: '', nome: '' },
        dataEntrega: editingEntry.dataEntrega || '',
        condicaoPagamento: editingEntry.condicaoPagamento || 0,
        contato: editingEntry.contato || '',
        dataEmissao: editingEntry.dataEmissao || '',
        numeroNotaFiscal: editingEntry.numeroNotaFiscal || '',
        numeroPedidoCompra: editingEntry.numeroPedidoCompra || '',
        chaveAcesso: editingEntry.chaveAcesso || '',
        observacao: editingEntry.observacao || '',
        cabecalho: editingEntry.cabecalho || {
          quantidadeItens: 0,
          totalQuantidade: 0,
          valorICMSSubstituicao: 0,
          valorTotalProdutos: 0,
          valorFrete: 0,
          valorSeguro: 0,
          valorDesconto: 0,
          outrasDespesasAcessorios: 0,
          valorTotalNota: 0,
        },
        produtos: editingEntry.produtos || [],
      });
      setProdutos(editingEntry.produtos || []);
    }
  }, [editingEntry, reset]);

  // Calculate totals when produtos change
  React.useEffect(() => {
    if (produtos.length > 0) {
      const quantidadeItens = produtos.length;
      const totalQuantidade = produtos.reduce((sum, p) => sum + p.quantidade, 0);
      const valorTotalProdutos = produtos.reduce((sum, p) => sum + p.valorTotal, 0);
      const valorICMSSubstituicao = produtos.reduce((sum, p) => sum + p.valorICMS, 0);
      const valorDesconto = produtos.reduce((sum, p) => sum + p.valorDesconto, 0);

      const valorFrete = watch('cabecalho.valorFrete') || 0;
      const valorSeguro = watch('cabecalho.valorSeguro') || 0;
      const outrasDespesas = watch('cabecalho.outrasDespesasAcessorios') || 0;

      const valorTotalNota =
        valorTotalProdutos + valorFrete + valorSeguro + outrasDespesas - valorDesconto;

      setValue('cabecalho.quantidadeItens', quantidadeItens);
      setValue('cabecalho.totalQuantidade', totalQuantidade);
      setValue('cabecalho.valorTotalProdutos', valorTotalProdutos);
      setValue('cabecalho.valorICMSSubstituicao', valorICMSSubstituicao);
      setValue('cabecalho.valorDesconto', valorDesconto);
      setValue('cabecalho.valorTotalNota', valorTotalNota);
      setValue('produtos', produtos);
    }
  }, [produtos, watch, setValue]);

  const addProduct = () => {
    const newProduct: ManualEntryProductInput = {
      codigo: '',
      descricao: '',
      aplicacao: '',
      quantidade: 0,
      valorUnitario: 0,
      valorTotal: 0,
      valorICMS: 0,
      valorIPI: 0,
      valorDesconto: 0,
      descontoTICompraSeg: 0,
      descontoTICompraImp: 0,
      compraAnterior: 0,
      compraAtual: 0,
      estoqueAtual: 0,
    };
    setProdutos([...produtos, newProduct]);
  };

  const removeProduct = (index: number) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof ManualEntryProductInput, value: any) => {
    const updated = [...produtos];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'quantidade' || field === 'valorUnitario') {
      updated[index].valorTotal = updated[index].quantidade * updated[index].valorUnitario;
    }

    setProdutos(updated);
  };

  const onSubmit = (data: CreateManualEntrySchema) => {
    if (!editingEntry?.id) {
      toast.error('ID da entrada manual não encontrado');
      return;
    }

    if (produtos.length === 0) {
      toast.error('Adicione pelo menos um produto');
      return;
    }

    updateEntry(
      {
        entry: { ...data, produtos },
        id: editingEntry.id,
      },
      {
        onSuccess: () => {
          toast.success('Entrada manual atualizada com sucesso!');
          setEditingEntry(null);
        },
        onError: (error: any) => {
          const errorData = error.response?.data;
          if (errorData?.errors) {
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages) && messages.length > 0) {
                setError(field as any, { message: messages[0] });
              }
            });
            toast.error('Erro de validação nos dados');
          } else {
            toast.error(errorData?.message || 'Erro ao atualizar entrada manual');
          }
        },
      }
    );
  };

  if (!editingEntry) return null;

  return (
    <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Entrada Manual</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Input placeholder="Empresa" {...register('fornecedor.nome')} />
              <Input placeholder="Código" {...register('codigo')} />
              <Input type="date" {...register('data')} />
            </div>

            <div className="flex gap-4 items-center">
              <Label className="font-semibold">NF Revenda</Label>
              <label className="flex items-center gap-2">
                <input type="radio" value="Sim" {...register('nfRevenda')} />
                <span>Sim</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="Não" {...register('nfRevenda')} />
                <span>Não</span>
              </label>
            </div>

            <Input placeholder="Fornecedor" {...register('fornecedor.nome')} />

            <div className="grid gap-4 md:grid-cols-3">
              <Input type="date" placeholder="Data de Entrega" {...register('dataEntrega')} />
              <Input
                type="number"
                placeholder="Condição de Pagto"
                {...register('condicaoPagamento', { valueAsNumber: true })}
              />
              <Input placeholder="Contato" {...register('contato')} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Input type="date" placeholder="Data de Emissão" {...register('dataEmissao')} />
              <Input placeholder="N. NF/Doc" {...register('numeroNotaFiscal')} />
              <Input placeholder="N. Pedido Compra" {...register('numeroPedidoCompra')} />
            </div>

            <Input placeholder="Chave de acesso" {...register('chaveAcesso')} maxLength={44} />
            <Textarea placeholder="Observação" {...register('observacao')} rows={3} />
          </div>

          <Separator className="my-6" />

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Cabeçalho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">Qtd Itens</Label>
                  <Input
                    type="number"
                    readOnly
                    value={watch('cabecalho.quantidadeItens')}
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label className="text-xs">Total Qtd</Label>
                  <Input
                    type="number"
                    readOnly
                    value={watch('cabecalho.totalQuantidade')}
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label className="text-xs">ICMS Subst.</Label>
                  <Input
                    type="number"
                    step="0.01"
                    readOnly
                    value={watch('cabecalho.valorICMSSubstituicao')}
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label className="text-xs">Total Produtos</Label>
                  <Input
                    type="number"
                    step="0.01"
                    readOnly
                    value={watch('cabecalho.valorTotalProdutos')}
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label className="text-xs">Frete*</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('cabecalho.valorFrete', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Seguro*</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('cabecalho.valorSeguro', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Desconto</Label>
                  <Input
                    type="number"
                    step="0.01"
                    readOnly
                    value={watch('cabecalho.valorDesconto')}
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label className="text-xs">Outras Desp.*</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('cabecalho.outrasDespesasAcessorios', { valueAsNumber: true })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs font-semibold">Total da Nota</Label>
                  <Input
                    type="number"
                    step="0.01"
                    readOnly
                    value={watch('cabecalho.valorTotalNota')}
                    className="bg-muted font-semibold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Produtos</h3>
              <Button type="button" onClick={addProduct} size="sm">
                <IconPlus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {produtos.length > 0 && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Aplicação</TableHead>
                      <TableHead className="w-20">Qtd</TableHead>
                      <TableHead className="w-28">Vlr Unit</TableHead>
                      <TableHead className="w-28">Vlr Total</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.map((produto, index) => (
                      <TableRow key={produto.id || index}>
                        <TableCell>
                          <Input
                            value={produto.codigo}
                            onChange={(e) => updateProduct(index, 'codigo', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={produto.descricao}
                            onChange={(e) => updateProduct(index, 'descricao', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={produto.aplicacao}
                            onChange={(e) => updateProduct(index, 'aplicacao', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={produto.quantidade}
                            onChange={(e) =>
                              updateProduct(index, 'quantidade', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={produto.valorUnitario}
                            onChange={(e) =>
                              updateProduct(index, 'valorUnitario', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={produto.valorTotal}
                            readOnly
                            className="bg-muted"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(index)}
                          >
                            <IconTrash className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingEntry(null)}
              disabled={isPending}
            >
              Voltar
            </Button>
            <Button type="submit" disabled={isPending || produtos.length === 0}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
