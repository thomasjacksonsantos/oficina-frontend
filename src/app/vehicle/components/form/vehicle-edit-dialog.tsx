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
import { useVehicleContext } from '../list/vehicle-context' ;
import { useUpdateVehicle } from '@/app/vehicle/api';
import { FloatingInput } from '@/components/ui/floating-input';

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
                <FloatingInput
                  id="edit-placa"
                  {...register('placa')}
                  label='Placa'
                />
                {errors.placa && (
                  <span className="text-sm text-red-500">{errors.placa.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-modelo">Modelo</Label>
                <FloatingInput id="edit-modelo" {...register('modelo')} label="Modelo" />
                {errors.modelo && (
                  <span className="text-sm text-red-500">{errors.modelo.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-montadora">Montadora</Label>
                <FloatingInput id="edit-montadora" {...register('montadora')} label='Montadora' />
                {errors.montadora && (
                  <span className="text-sm text-red-500">{errors.montadora.message}</span>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-hodrometro">Hodômetro (km)</Label>
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
                <Label htmlFor="edit-cor">Cor</Label>
                <FloatingInput id="edit-cor" {...register('cor')} label='Cor' />
                {errors.cor && <span className="text-sm text-red-500">{errors.cor.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-ano">Ano</Label>
                <FloatingInput
                  id="edit-ano"
                  {...register('ano')}
                  label='Ano'
                />
                {errors.ano && <span className="text-sm text-red-500">{errors.ano.message}</span>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-motorizacao">Motorização</Label>
                <FloatingInput
                  id="edit-motorizacao"
                  {...register('motorizacao')}
                  label='Motorizacao'
                />
                {errors.motorizacao && (
                  <span className="text-sm text-red-500">{errors.motorizacao.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-chassi">Chassi</Label>
                <FloatingInput
                  id="edit-chassi"
                  {...register('chassi')}
                  label="Chassi"
                />
                {errors.chassi && (
                  <span className="text-sm text-red-500">{errors.chassi.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-numero-serie">Número de Série</Label>
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