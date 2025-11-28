'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsible-dialog';
import { useState, useEffect } from 'react';
import { FilePlus } from 'lucide-react';
import { useVehicleContext } from './vehicle-context';
import { Link } from '@tanstack/react-router';
import DeleteVehicleForm from '../forms/delete-vehicle-form';
import EditVehicleForm from '../form/vehicle-edit-dialog';
import ViewVehicleForm from '../form/vehicle-view-dialog';

export default function VehicleHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingVehicle, setDeletingVehicle } = useVehicleContext();
  useEffect(() => {
    if (deletingVehicle) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingVehicle]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingVehicle(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar veículo"
        description="Tem certeza que deseja deletar este veículo?"
      >
        {deletingVehicle && (
          <DeleteVehicleForm vehicleId={deletingVehicle.id} setIsOpen={handleCloseDelete} />
        )}
      </ResponsiveDialog>
      <EditVehicleForm />
      <ViewVehicleForm />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Veículos</h2>
          <span className="text-muted-foreground">Gerencie seus veículos aqui.</span>
        </div>
        <div>
          <Link to="/veiculos/new">
            <Button variant="default">
              <FilePlus className="mr-2 h-4 w-4" />
              Novo Veículo
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}