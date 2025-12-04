'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { paymentFormSchema, type CreatePaymentFormSchema } from './payment-form.schema';
import { toast, Toaster } from 'sonner';
import { useCreatePaymentForm } from '@/app/payment-form/api';
import { usePaymentFormContext } from '../list';
import { FloatingInput } from '@/components/ui/floating-input';

export default function PaymentFormForm() {
  const router = useRouter();
  const { registeringPaymentForm, setRegisteringPaymentForm } = usePaymentFormContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreatePaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      descricao: '',
      numeroParcela: 0,
      tipoPagamento: '',
      planoParcelamento: '',
    },
  });

  React.useEffect(() => {
    if (!registeringPaymentForm) {
      reset();
    }
  }, [registeringPaymentForm, reset]);

  const { mutate: createPaymentForm, isPending } = useCreatePaymentForm();

  const tipoPagamento = watch('tipoPagamento');

  const onSubmit = (data: CreatePaymentFormSchema) => {
    const create: CreatePaymentFormSchema = {
      ...data,
    };

    createPaymentForm(create, {
      onSuccess: (result) => {
        if (result) {
          setRegisteringPaymentForm(null);
          toast.success('Forma de pagamento criada com sucesso!');
        } else {
          toast.error(`Erro ao criar forma de pagamento: ${result}`);
        }
      },
      onError: (error: any) => {
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
        }

        toast.error('Erro de validação', {
          description: 'Erro(es) encontrados nos dados enviados.',
        });
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Dialog open={!!registeringPaymentForm} onOpenChange={() => setRegisteringPaymentForm(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Forma de Pagamento</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="payment-form-descricao"
                    {...register('descricao')}
                    label="Descrição"
                    className="rounded-md"
                  />
                  {errors.descricao && (
                    <span className="text-sm text-red-500">{errors.descricao.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="payment-form-numero-parcela"
                    {...register('numeroParcela')}
                    label="Número de Parcelas"
                    className="rounded-md"
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
                  <Label htmlFor="payment-form-tipo-pagamento">Tipo de Pagamento</Label>
                  <Select
                    onValueChange={(value) => setValue('tipoPagamento', value, { shouldValidate: true })}
                    value={tipoPagamento}
                  >
                    <SelectTrigger id="payment-form-tipo-pagamento">
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
                    id="payment-form-plano-parcelamento"
                    {...register('planoParcelamento')}
                    label="Plano de Parcelamento"
                    className="rounded-md"
                  />
                  {errors.planoParcelamento && (
                    <span className="text-sm text-red-500">{errors.planoParcelamento.message}</span>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setRegisteringPaymentForm(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}