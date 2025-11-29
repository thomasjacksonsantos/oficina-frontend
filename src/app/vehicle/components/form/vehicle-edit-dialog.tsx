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
import { useForm } from 'react-hook-form';
import { vehicleSchema, type CreateVehicleSchema } from './vehicle.schema';
import { toast } from 'sonner';
import { useVehicleContext } from '../list/vehicle-context';
import { useUpdateVehicle } from '@/app/vehicle/api';

export default function VehicleEditDialog() {
  const { editingVehicle, setEditingVehicle } = useVehicleContext();
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateVehicleSchema>({
    resolver: zodResolver(vehicleSchema),
  });

  React.useEffect(() => {
    if (editingVehicle) {
      reset({
        placa: editingVehicle.placa || '',
        modelo: editingVehicle.modelo || '',
        montadora: editingVehicle.montadora || '',
        hodrometro: editingVehicle.hodrometro || 0,
        cor: editingVehicle.cor || '',
        motorizacao: editingVehicle.motorizacao || '',
        ano: editingVehicle.ano || '',
        numeroSerie: editingVehicle.numeroSerie || '',
        chassi: editingVehicle.chassi || '',
      });
    }
  }, [editingVehicle, reset]);

  const onSubmit = (data: CreateVehicleSchema) => {
    if (!editingVehicle?.id) {
      toast.error('ID do veículo não encontrado');
      return;
    }

    console.log('Submitting update for vehicle ID:', editingVehicle.id);
    console.log('Data:', data);

    // FIXED: Changed the mutation call structure
    updateVehicle(
      {
        vehicle: data, // Send data directly, not wrapped in vehicle object
        id: editingVehicle.id
      },
      {
        onSuccess: () => {
          toast.success('Veículo atualizado com sucesso!');
          setEditingVehicle(null);
        },
        onError: (error: any) => {
          console.error('Update error:', error);
          
          const fieldMapping: Record<string, string> = {
            placa: 'placa',
            modelo: 'modelo',
            montadora: 'montadora',
            hodrometro: 'hodrometro',
            cor: 'cor',
            motorizacao: 'motorizacao',
            ano: 'ano',
            chassi: 'chassi',
            numeroSerie: 'numeroSerie',
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
            toast.error(errorData?.message || 'Erro ao atualizar veículo');
          }
        },
      }
    );
  };

  const handleHodometroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('hodrometro', value ? parseInt(value, 10) : 0, { shouldValidate: true });
  };

  if (!editingVehicle) return null;

  return (
    <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Veículo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-placa">Placa</Label>
                <Input
                  id="edit-placa"
                  {...register('placa')}
                  placeholder="ABC1D23"
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
                <Label htmlFor="edit-modelo">Modelo</Label>
                <Input id="edit-modelo" {...register('modelo')} placeholder="Civic EXL" />
                {errors.modelo && (
                  <span className="text-sm text-red-500">{errors.modelo.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-montadora">Montadora</Label>
                <Input id="edit-montadora" {...register('montadora')} placeholder="Honda" />
                {errors.montadora && (
                  <span className="text-sm text-red-500">{errors.montadora.message}</span>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-hodrometro">Hodômetro (km)</Label>
                <Input
                  id="edit-hodrometro"
                  value={watch('hodrometro') || ''}
                  onChange={handleHodometroChange}
                  placeholder="45000"
                  inputMode="numeric"
                />
                {errors.hodrometro && (
                  <span className="text-sm text-red-500">{errors.hodrometro.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-cor">Cor</Label>
                <Input id="edit-cor" {...register('cor')} placeholder="Prata" />
                {errors.cor && <span className="text-sm text-red-500">{errors.cor.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-ano">Ano</Label>
                <Input
                  id="edit-ano"
                  {...register('ano')}
                  placeholder="2023"
                  inputMode="numeric"
                  maxLength={4}
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
                <Label htmlFor="edit-motorizacao">Motorização</Label>
                <Input
                  id="edit-motorizacao"
                  {...register('motorizacao')}
                  placeholder="2.0 16V Flex"
                />
                {errors.motorizacao && (
                  <span className="text-sm text-red-500">{errors.motorizacao.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-chassi">Chassi</Label>
                <Input
                  id="edit-chassi"
                  {...register('chassi')}
                  placeholder="9BWZZZ377VT004251"
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
                <Label htmlFor="edit-numero-serie">Número de Série</Label>
                <Input
                  id="edit-numero-serie"
                  {...register('numeroSerie')}
                  placeholder="HC2023-45678"
                />
                {errors.numeroSerie && (
                  <span className="text-sm text-red-500">{errors.numeroSerie.message}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingVehicle(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}