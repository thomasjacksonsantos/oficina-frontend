
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useVehicleContext } from '../list/vehicle-context';

export default function VehicleViewDialog() {
  const { viewingVehicle, setViewingVehicle } = useVehicleContext();

  if (!viewingVehicle) return null;

  return (
    <Dialog open={!!viewingVehicle} onOpenChange={() => setViewingVehicle(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Veículo</DialogTitle>
        </DialogHeader>
        
        <Separator />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Placa</Label>
              <p className="font-medium">{viewingVehicle.placa}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Modelo</Label>
              <p className="font-medium">{viewingVehicle.modelo}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Montadora</Label>
              <p className="font-medium">{viewingVehicle.montadora}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Hodômetro</Label>
              <p className="font-medium">{viewingVehicle.hodrometro?.toLocaleString()} km</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Cor</Label>
              <p className="font-medium">{viewingVehicle.cor}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Ano</Label>
              <p className="font-medium">{viewingVehicle.ano}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-muted-foreground">Motorização</Label>
              <p className="font-medium">{viewingVehicle.motorizacao || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Chassi</Label>
              <p className="font-medium">{viewingVehicle.chassi || '-'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Número de Série</Label>
              <p className="font-medium">{viewingVehicle.numeroSerie || '-'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
