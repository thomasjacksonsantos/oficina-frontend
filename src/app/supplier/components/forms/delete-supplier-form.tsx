'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useDeleteSupplier } from '../../api/use-delete-supplier';

const formSchema = z.object({
  supplierId: z.string(),
});

export default function DeleteSupplierForm({
  supplierId,
  setIsOpen,
}: {
  supplierId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { mutate: deleteSupplier, isPending } = useDeleteSupplier();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: supplierId,
    },
  });

  const onSubmit = async () => {
    try {
      deleteSupplier(supplierId, {
        onSuccess: () => {
          toast.success('Fornecedor deletado com sucesso!');
          setIsOpen(false);
        },
        onError: () => {
          toast.error('Erro ao deletar fornecedor. Tente novamente.');
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Erro ao deletar fornecedor. Tente novamente.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:px-0 px-4">
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja deletar este fornecedor? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="w-full flex justify-center sm:space-x-6">
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            className="hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            type="submit"
            disabled={isPending}
            className="bg-red-500 hover:bg-red-400"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deletando
              </>
            ) : (
              <span>Deletar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
