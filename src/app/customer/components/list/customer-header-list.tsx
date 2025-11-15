"use client"

import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsible-dialog"
import { useState, useEffect } from "react"
import { FilePlus } from "lucide-react"
import { useCustomerContext } from "./customer-context"
import DeleteCustomerForm from "../forms/delete-customer-form"
import Customer from "../.."
import CustomerFormDialog from "../form/customer-form-dialog"

export default function CustomerHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deletingCustomer, setDeletingCustomer } = useCustomerContext();
  useEffect(() => {
    if (deletingCustomer) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingCustomer]);

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingCustomer(null);
  };

  return (
    <>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar cliente"
        description="Tem certeza que deseja deletar este cliente?"
      >
        {deletingCustomer && (
          <DeleteCustomerForm
            customerId={deletingCustomer.id}
            setIsOpen={handleCloseDelete}
          />
        )}
      </ResponsiveDialog>

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Cliente
          </h2>
          <span className="text-muted-foreground">
            Gerencie seus clientes aqui.
          </span>
        </div>
        <div>
          <CustomerFormDialog />
        </div>
      </div>
    </>
  )
}

