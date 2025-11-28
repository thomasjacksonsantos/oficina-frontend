
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { Route, useRouter, useParams } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { vehicleSchema, type CreateVehicleSchema } from './vehicle.schema';
import { toast, Toaster } from 'sonner';

import { useCreateVehicle } from '@/app/vehicle/api';

export default function VehicleForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
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

  const onSubmit = (data: CreateVehicleSchema) => {
    const create: CreateVehicleSchema = {
      ...data,
    };

    createVehicle(create, {
      onSuccess: (result) => {
        if (result) {
          router.navigate({ to: '/veiculos' });
        } else {
          toast.error(`Erro ao criar cliente: ${result}`);
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

  const handleHodometroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('hodrometro', value ? parseInt(value, 10) : 0, { shouldValidate: true });
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="rounded-lg">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Veículos</h2>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-placa">Placa</Label>
                  <Input
                    id="veiculo-placa"
                    {...register('placa')}
                    placeholder="ABC1D23"
                    className="rounded-md"
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
                  <Label htmlFor="veiculo-modelo">Modelo</Label>
                  <Input
                    id="veiculo-modelo"
                    {...register('modelo')}
                    placeholder="Civic EXL"
                    className="rounded-md"
                  />
                  {errors.modelo && (
                    <span className="text-sm text-red-500">{errors.modelo.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-montadora">Montadora</Label>
                  <Input
                    id="veiculo-montadora"
                    {...register('montadora')}
                    placeholder="Honda"
                    className="rounded-md"
                  />
                  {errors.montadora && (
                    <span className="text-sm text-red-500">{errors.montadora.message}</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-hodrometro">Hodômetro (km)</Label>
                  <Input
                    id="veiculo-hodrometro"
                    value={watch('hodrometro') || ''}
                    onChange={handleHodometroChange}
                    placeholder="45000"
                    inputMode="numeric"
                    className="rounded-md"
                  />
                  {errors.hodrometro && (
                    <span className="text-sm text-red-500">{errors.hodrometro.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-cor">Cor</Label>
                  <Input
                    id="veiculo-cor"
                    {...register('cor')}
                    placeholder="Prata"
                    className="rounded-md"
                  />
                  {errors.cor && <span className="text-sm text-red-500">{errors.cor.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-ano">Ano</Label>
                  <Input
                    id="veiculo-ano"
                    {...register('ano')}
                    placeholder="2023"
                    inputMode="numeric"
                    maxLength={4}
                    className="rounded-md"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setValue('ano', value, { shouldValidate: true });
                    }}
                  />
                  {errors.ano && <span className="text-sm text-red-500">{errors.ano.message}</span>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-motorizacao">Motorização</Label>
                  <Input
                    id="veiculo-motorizacao"
                    {...register('motorizacao')}
                    placeholder="2.0 16V Flex"
                    className="rounded-md"
                  />
                  {errors.motorizacao && (
                    <span className="text-sm text-red-500">{errors.motorizacao.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-chassi">Chassi</Label>
                  <Input
                    id="veiculo-chassi"
                    {...register('chassi')}
                    placeholder="9BWZZZ377VT004251"
                    className="rounded-md"
                  />
                  {errors.chassi && (
                    <span className="text-sm text-red-500">{errors.chassi.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="veiculo-numero-serie">Número de Série</Label>
                  <Input
                    id="veiculo-numero-serie"
                    {...register('numeroSerie')}
                    placeholder="HC2023-45678"
                    className="rounded-md"
                  />
                  {errors.numeroSerie && (
                    <span className="text-sm text-red-500">{errors.numeroSerie.message}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  router.navigate({ to: '/veiculos' });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Veículo'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}