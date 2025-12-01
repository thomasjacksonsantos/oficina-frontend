'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Labels are now part of the floating inputs (label prop)
import { FloatingInput } from '@/components/ui/floating-input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { vehicleSchema, type CreateVehicleSchema } from './vehicle.schema';
import { toast, Toaster } from 'sonner';

import { useCreateVehicle } from '@/app/vehicle/api';
import { useVehicleContext } from '../list/vehicle-context';

export default function VehicleForm() {
  const { registeringVehicle, setRegisteringVehicle } = useVehicleContext();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateVehicleSchema>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      placa: '',
      modelo: '',
      montadora: '',
      hodrometro: 0,
      cor: '',
      motorizacao: '',
      ano: '',
      numeroSerie: '',
      chassi: '',
    },
  });

  const { mutate: createVehicle, isPending } = useCreateVehicle();

  React.useEffect(() => {
    if (!registeringVehicle) {
      reset();
    }
  }, [registeringVehicle, reset]);

  const onSubmit = (data: CreateVehicleSchema) => {
    const create: CreateVehicleSchema = {
      ...data,
    };

    createVehicle(create, {
      onSuccess: (result) => {
        if (result) {
          setRegisteringVehicle(null);
          toast.success('Veículo criado com sucesso!');
        } else {
          toast.error(`Erro ao criar veículo: ${result}`);
        }
      },
      onError: (error: any) => {
        const fieldMapping: Record<string, string> = {
          placa: 'placa',
          modelo: 'modelo',
          montadora: 'montadora',
          hodrometro: 'hodrometro',
          cor: 'cor',
          motorizacao: 'motorizacao',
          ano: 'ano',
          numeroSerie: 'numeroSerie',
          chassi: 'chassi',
        };

        const errorData = error.response?.data;
        Object.entries(errorData.errors).forEach(([apiField, messages]) => {
          const formField = fieldMapping[apiField];

          if (formField && Array.isArray(messages) && messages.length > 0) {
            setError(formField as any, {
              type: 'manual',
              message: messages[0],
            });
          }
        });

        toast.error('Erro de validação', {
          description: 'Erro(es) encontrados nos dados enviados.',
        });
      },
    });
  };


  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Toaster position="top-right" richColors />
      <Dialog open={!!registeringVehicle} onOpenChange={() => setRegisteringVehicle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registor Veículo</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-placa"
                    {...register('placa')}
                    label="Placa"
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase();
                      setValue('placa', upper, { shouldValidate: true });
                    }}
                  />
                  {errors.placa && (
                    <span className="text-sm text-red-500">{errors.placa.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput id="edit-modelo" {...register('modelo')} label="Modelo" />
                  {errors.modelo && (
                    <span className="text-sm text-red-500">{errors.modelo.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput id="edit-montadora" {...register('montadora')} label="Montadora" />
                  {errors.montadora && (
                    <span className="text-sm text-red-500">{errors.montadora.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-hodrometro"
                    {...register('hodrometro')}
                    label="Hodômetro (km)"
                    inputMode="numeric"
                  />
                  {errors.hodrometro && (
                    <span className="text-sm text-red-500">{errors.hodrometro.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput id="edit-cor" {...register('cor')} label="Cor" />
                  {errors.cor && <span className="text-sm text-red-500">{errors.cor.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-ano"
                    {...register('ano')}
                    label="Ano"
                  />
                  {errors.ano && <span className="text-sm text-red-500">{errors.ano.message}</span>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-motorizacao"
                    {...register('motorizacao')}
                    label="Motorização"
                  />
                  {errors.motorizacao && (
                    <span className="text-sm text-red-500">{errors.motorizacao.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-chassi"
                    {...register('chassi')}
                    label="Chassi"
                    maxLength={17}
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase();
                      setValue('chassi', upper, { shouldValidate: true });
                    }}
                  />
                  {errors.chassi && (
                    <span className="text-sm text-red-500">{errors.chassi.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <FloatingInput
                    id="edit-numero-serie"
                    {...register('numeroSerie')}
                    label="Número de Série"
                  />
                  {errors.numeroSerie && (
                    <span className="text-sm text-red-500">{errors.numeroSerie.message}</span>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setRegisteringVehicle(null)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Salvando...' : 'Salvar Veículo'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
