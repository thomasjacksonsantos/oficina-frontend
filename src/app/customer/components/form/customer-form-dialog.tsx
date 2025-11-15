
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { FilePlus } from "lucide-react";
import CustomerForm from "./customer-form";
import { Button } from "@/components/ui";

export default function CustomerFormDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Novo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0">
                <CustomerForm />
            </DialogContent>
        </Dialog>
    );
}