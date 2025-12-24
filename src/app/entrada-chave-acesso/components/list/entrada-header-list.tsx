// app/entrada-chave-acesso/components/list/entrada-header-list.tsx

'use client';

import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { useEntradaContext } from './entrada-context';
import ConsultarEntradaDialog from '../form/consultar-entrada-dialog';
import ImportarNotaDialog from '../form/importar-nota-dialog';

export default function EntradaHeaderList() {
  const { setConsultingEntry } = useEntradaContext();

  return (
    <>
      <ConsultarEntradaDialog />
      <ImportarNotaDialog />

      <div className="flex mb-2 flex-wrap items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Entrada por Chave de Acesso</h2>
          <span className="text-muted-foreground">
            Gerencie suas entradas de notas fiscais aqui.
          </span>
        </div>
        <div>
          <Button onClick={() => setConsultingEntry(true)} variant="default">
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Entrada
          </Button>
        </div>
      </div>
    </>
  );
}