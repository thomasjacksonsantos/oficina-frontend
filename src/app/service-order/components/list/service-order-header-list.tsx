"use client"

import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsible-dialog"
import DeleteServiceOrderForm from "../forms/delete-service-order-form"
import { useState, useEffect } from "react"
import { FilePlus } from "lucide-react"
import { useServiceOrderContext } from "./service-order-context"
import { Link } from "@tanstack/react-router"

export default function ServiceOrderHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingServiceOrder, setDeletingServiceOrder } = useServiceOrderContext();
  useEffect(() => {
    if (deletingServiceOrder) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingServiceOrder]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingServiceOrder(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar ordem de serviço"
        description="Tem certeza que deseja deletar esta ordem de serviço?"
      >
        {deletingServiceOrder && (
          <DeleteServiceOrderForm
            serviceOrderId={deletingServiceOrder.id}
            setIsOpen={handleCloseDelete}
          />
        )}
      </ResponsiveDialog>

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ordens de Serviço
          </h2>
          <span className="text-muted-foreground">
            Gerencie suas ordens de serviço
          </span>
        </div>
        <div>
          <Link to="/service-order/new">
            <Button
              variant="default"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Nova Ordem
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}

