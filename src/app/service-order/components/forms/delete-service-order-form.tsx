'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useDeleteServiceOrder } from '@/app/service-order/api';

const formSchema = z.object({
  serviceOrderId: z.number(),
});

export default function DeleteServiceOrderForm({
  serviceOrderId,
  setIsOpen,
}: {
  serviceOrderId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { mutate: deleteServiceOrder, isPending } = useDeleteServiceOrder();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceOrderId: serviceOrderId,
    },
  });

  const onSubmit = async () => {
    try {
      deleteServiceOrder(serviceOrderId, {
        onSuccess: () => {
          toast.success("Ordem de serviço deletada com sucesso!");
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Erro ao deletar ordem de serviço. Tente novamente.");
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao deletar ordem de serviço. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:px-0 px-4"
      >
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja deletar esta ordem de serviço? Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="w-full flex justify-center sm:space-x-6">
          <Button
            size="lg"
            variant="outline"
            disabled={isPending}
            className="w-full hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isPending}
            className="w-full bg-red-500 hover:bg-red-400"
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

