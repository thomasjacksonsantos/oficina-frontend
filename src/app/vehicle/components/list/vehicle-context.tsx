"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Vehicle } from "@/api/vehicle.types";

interface VehicleContextType {
  viewingVehicle: Vehicle | null;
  editingVehicle: Vehicle | null;
  deletingVehicle: Vehicle | null;
  activingVehicle: string | null;
  deactivingVehicle: string | null;
  registeringVehicle: boolean | null;
  setViewingVehicle: (vehicle: Vehicle | null) => void;
  setEditingVehicle: (vehicle: Vehicle | null) => void;
  setDeletingVehicle: (vehicle: Vehicle | null) => void;
  setActivingVehicle: (vehicleId: string | null) => void;
  setDeactivingVehicle: (vehicleId: string | null) => void;
  setRegisteringVehicle: (registering: boolean | null) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [activingVehicle, setActivingVehicle] = useState<string | null>(null);
  const [deactivingVehicle, setDeactivingVehicle] = useState<string | null>(null);
  const [registeringVehicle, setRegisteringVehicle] = useState<boolean | null>(false);
  return (
    <VehicleContext.Provider
      value={{
        viewingVehicle,
        editingVehicle,
        deletingVehicle,
        activingVehicle,
        deactivingVehicle,
        registeringVehicle,
        setViewingVehicle,
        setEditingVehicle,
        setDeletingVehicle,
        setActivingVehicle,
        setDeactivingVehicle,
        setRegisteringVehicle
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicleContext() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error("useVehicleContext must be used within a VehicleProvider");
  }
  return context;
}

