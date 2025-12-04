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
import { useForm } from 'react-hook-form';
import { paymentFormSchema, type CreatePaymentFormSchema } from './payment-form.schema';
import { toast } from 'sonner';
import { usePaymentFormContext } from '../list/payment-form-context';
import { useUpdatePaymentForm } from '@/app/payment-form/api';
import { FloatingInput } from '@/components/ui/floating-input';

export default function PaymentFormEditDialog() {
  const { editingPaymentForm, setEditingPaymentForm } = usePaymentFormContext();
  const { mutate: updatePaymentForm, isPending } = useUpdatePaymentForm();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
  });

  React.useEffect(() => {
    if (editingPaymentForm) {
      reset({
        descricao: editingPaymentForm.descricao || '',
        numeroParcela: editingPaymentForm.numeroParcela || 0,
        tipoPagamento: editingPaymentForm.tipoPagamento || '',
        planoParcelamento: editingPaymentForm.planoParcelamento || '',
      });
    }
  }, [editingPaymentForm, reset]);

  const tipoPagamento = watch('tipoPagamento');

  const onSubmit = (data: CreatePaymentFormSchema) => {
    if (!editingPaymentForm?.id) {
      toast.error('ID da forma de pagamento não encontrado');
      return;
    }

    updatePaymentForm(
      {
        paymentForm: data,
        id: editingPaymentForm.id,
      },
      {
        onSuccess: () => {
          toast.success('Forma de pagamento atualizada com sucesso!');
          setEditingPaymentForm(null);
        },
        onError: (error: any) => {
          console.error('Update error:', error);

          const fieldMapping: Record<string, string> = {
            descricao: 'descricao',
            numeroParcela: 'numeroParcela',
            tipoPagamento: 'tipoPagamento',
            planoParcelamento: 'planoParcelamento',
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
            toast.error(errorData?.message || 'Erro ao atualizar forma de pagamento');
          }
        },
      }
    );
  };

  if (!editingPaymentForm) return null;

  return (
    <Dialog open={!!editingPaymentForm} onOpenChange={() => setEditingPaymentForm(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Forma de Pagamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-descricao"
                  {...register('descricao')}
                  label="Descrição"
                />
                {errors.descricao && (
                  <span className="text-sm text-red-500">{errors.descricao.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-numero-parcela"
                  {...register('numeroParcela')}
                  label="Número de Parcelas"
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setValue('numeroParcela', Number(value), { shouldValidate: true });
                  }}
                />
                {errors.numeroParcela && (
                  <span className="text-sm text-red-500">{errors.numeroParcela.message}</span>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-tipo-pagamento">Tipo de Pagamento</Label>
                <Select
                  onValueChange={(value) => setValue('tipoPagamento', value, { shouldValidate: true })}
                  value={tipoPagamento}
                >
                  <SelectTrigger id="edit-tipo-pagamento">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À Vista">À Vista</SelectItem>
                    <SelectItem value="Parcelado">Parcelado</SelectItem>
                    <SelectItem value="Crediário">Crediário</SelectItem>
                    <SelectItem value="Faturado">Faturado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipoPagamento && (
                  <span className="text-sm text-red-500">{errors.tipoPagamento.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <FloatingInput
                  id="edit-plano-parcelamento"
                  {...register('planoParcelamento')}
                  label="Plano de Parcelamento"
                />
                {errors.planoParcelamento && (
                  <span className="text-sm text-red-500">{errors.planoParcelamento.message}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingPaymentForm(null)}
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