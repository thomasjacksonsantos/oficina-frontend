
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { FilePlus } from "lucide-react";
import CustomerForm from "./customer-form";
import { Button } from "@/components/ui";
import { useState } from "react";

export default function CustomerFormDialog() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0">
                <CustomerForm setIsOpen={setIsOpen} />
            </DialogContent>
        </Dialog>
    );
}