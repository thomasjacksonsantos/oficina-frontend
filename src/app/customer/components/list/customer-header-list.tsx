"use client"

import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsible-dialog"
import { useState, useEffect } from "react"
import { FilePlus } from "lucide-react"
import { useCustomerContext } from "./customer-context"
import DeleteCustomerForm from "../forms/delete-customer-form"
import CustomerFormDialog from "../form/customer-form-dialog"
import EditCustomerForm from "../forms/edit-customer-form"

export default function CustomerHeaderList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    editingCustomer,
    setEditingCustomer,
    deletingCustomer,
    setDeletingCustomer
  } = useCustomerContext();

  //Editing
  useEffect(() => {
    if (editingCustomer) {
      setIsEditOpen(true);
    } else {
      setIsEditOpen(false);
    }
  }, [editingCustomer]);

  // Deleting
  useEffect(() => {
    if (deletingCustomer) {
      setIsDeleteOpen(true);
    } else {
      setIsDeleteOpen(false);
    }
  }, [deletingCustomer]);

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditingCustomer(null);
  };

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

      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title=""
        description=""
        className="p-0"
      >
        {editingCustomer && (
          <EditCustomerForm
            customer={editingCustomer!}
            setIsOpen={handleCloseEdit}
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

