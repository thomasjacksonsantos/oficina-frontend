"use client"

import { Button } from "@/components/ui/button"

import { ResponsiveDialog } from "@/components/ui/responsible-dialog"

import UserForm from "../forms/user-form"
import DeleteForm from "../forms/delete-form"

import { useState } from "react"
import { User2 } from "lucide-react"

export default function UserHeaderList() {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <>
            <ResponsiveDialog
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                title="Cadastrar usuário"
            >
                <UserForm setIsOpen={setIsEditOpen} />
            </ResponsiveDialog>
            <ResponsiveDialog
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                title="Delete Person"
                description="Are you sure you want to delete this person?"
            >
                <DeleteForm cardId={"1"} setIsOpen={setIsDeleteOpen} />
            </ResponsiveDialog>

            <div className="flex mb-2 flex-wrap items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Usuário
                    </h2>
                    <span className="text-muted-foreground">
                        Aqui esta todos os seus clientes
                    </span>
                </div>
                <div>
                    <Button
                        variant="destructive"
                        onClick={() => setIsEditOpen(true)}
                    >
                        Cadastrar Cliente
                        <User2 />
                    </Button>
                </div>
            </div>
        </>
    )
}