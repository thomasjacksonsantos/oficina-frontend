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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { bandeiraCartaoSchema, type CreateBandeiraCartaoSchema } from './bandeira-cartao.schema';
import { toast } from 'sonner';
import { useBandeiraCartaoContext } from '../list/bandeira-cartao-context';
import { useUpdateBandeiraCartao } from '@/app/bandeira-cartao/api';
import { FloatingInput } from '@/components/ui/floating-input';

// Mock data for dropdowns
const PLANOS_CONTA = [
  'Plano de Conta dos Recebimentos A',
  'Plano de Conta dos Recebimentos B',
  'Plano de Conta dos Recebimentos C',
  'Plano de Conta dos Recebimentos D',
  'Plano de Conta dos Recebimentos E',
];

const FORMAS_PAGAMENTO = [
  'Crédito',
  'Débito',
  'Vale Refeição',
  'Vale Alimentação',
  'PIX',
];

const BANCOS = [
  'Itaú',
  'Bradesco',
  'Santander',
  'Banco do Brasil',
  'Caixa',
  'Banrisul',
  'Nubank',
  'Inter',
];

export default function BandeiraCartaoEditDialog() {
  const { editingBandeiraCartao, setEditingBandeiraCartao } = useBandeiraCartaoContext();
  const { mutate: updateBandeiraCartao, isPending } = useUpdateBandeiraCartao();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateBandeiraCartaoSchema>({
    resolver: zodResolver(bandeiraCartaoSchema),
  });

  React.useEffect(() => {
    if (editingBandeiraCartao) {
      reset({
        descricao: editingBandeiraCartao.descricao || '',
        planoContaRecebimento: editingBandeiraCartao.planoContaRecebimento || '',
        formaPagamento: editingBandeiraCartao.formaPagamento || '',
        banco: {
          nome: editingBandeiraCartao.banco?.nome || '',
        },
      });
    }
  }, [editingBandeiraCartao, reset]);

  const onSubmit = (data: CreateBandeiraCartaoSchema) => {
    if (!editingBandeiraCartao?.id) {
      toast.error('ID da bandeira de cartão não encontrado');
      return;
    }

    updateBandeiraCartao(
      {
        bandeiraCartao: data,
        id: editingBandeiraCartao.id,
      },
      {
        onSuccess: () => {
          toast.success('Bandeira de cartão atualizada com sucesso!');
          setEditingBandeiraCartao(null);
        },
        onError: (error: any) => {
          console.error('Update error:', error);

          const fieldMapping: Record<string, string> = {
            descricao: 'descricao',
            planoContaRecebimento: 'planoContaRecebimento',
            formaPagamento: 'formaPagamento',
            'banco.nome': 'banco.nome',
          };

          const errorData = error.response?.data;
          if (errorData?.errors) {
            Object.entries(errorData.errors).forEach(([apiField, messages]) => {
              const formField = fieldMapping[apiField];
              if (formField && Array.isArray(messages) && messages.length > 0) {
                setError(formField as any, {
                  type: 'manual',
                  message: messages[0],
                });
              }
            });
            toast.error('Erro de validação nos dados');
          } else {
            toast.error(errorData?.message || 'Erro ao atualizar bandeira de cartão');
          }
        },
      }
    );
  };

  if (!editingBandeiraCartao) return null;

  return (
    <Dialog open={!!editingBandeiraCartao} onOpenChange={() => setEditingBandeiraCartao(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Bandeira de Cartão</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            {/* Descrição da Bandeira */}
            <div className="flex flex-col gap-2">
              <FloatingInput 
                id="edit-descricao" 
                {...register('descricao')} 
                label="Descrição da Bandeira" 
              />
              {errors.descricao && (
                <span className="text-sm text-red-500">{errors.descricao.message}</span>
              )}
            </div>

            {/* Plano de Conta dos Recebimentos */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-plano-conta">Plano de Conta dos Recebimentos</Label>
              <Controller
                name="planoContaRecebimento"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-plano-conta">
                      <SelectValue placeholder="Selecione um plano de conta" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLANOS_CONTA.map((plano) => (
                        <SelectItem key={plano} value={plano}>
                          {plano}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.planoContaRecebimento && (
                <span className="text-sm text-red-500">{errors.planoContaRecebimento.message}</span>
              )}
            </div>

            {/* Forma de Recebimento */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-forma-pagamento">Forma de Recebimento</Label>
              <Controller
                name="formaPagamento"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-forma-pagamento">
                      <SelectValue placeholder="Selecione uma forma de recebimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMAS_PAGAMENTO.map((forma) => (
                        <SelectItem key={forma} value={forma}>
                          {forma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.formaPagamento && (
                <span className="text-sm text-red-500">{errors.formaPagamento.message}</span>
              )}
            </div>

            {/* Banco */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-banco-nome">Informe o banco</Label>
              <Controller
                name="banco.nome"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="edit-banco-nome">
                      <SelectValue placeholder="Selecione um banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANCOS.map((banco) => (
                        <SelectItem key={banco} value={banco}>
                          {banco}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.banco?.nome && (
                <span className="text-sm text-red-500">{errors.banco.nome.message}</span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingBandeiraCartao(null)}
              disabled={isPending}
            >
              Voltar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}