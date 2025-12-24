// app/entrada-chave-acesso/components/form/consultar-entrada-dialog.tsx

'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FloatingInput } from '@/components/ui/floating-input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useEntradaContext } from '../list/entrada-context';
import { useConsultarPorChave, useConsultarPorXml } from '@/app/entrada-chave-acesso/api';
import { Loader2, Upload, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConsultarEntradaDialog() {
  const { consultingEntry, setConsultingEntry, setViewingNotaFiscal } = useEntradaContext();
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [lojaId] = useState('uk'); // Default loja ID

  const { mutate: consultarPorChave, isPending: isPendingChave } = useConsultarPorChave();
  const { mutate: consultarPorXml, isPending: isPendingXml } = useConsultarPorXml();

  const handleConsultarChave = async () => {
    if (!chaveAcesso || chaveAcesso.trim().length === 0) {
      toast.error('Informe a chave de acesso');
      return;
    }

    if (chaveAcesso.length !== 44) {
      toast.error('Chave de acesso deve conter 44 dígitos');
      return;
    }

    consultarPorChave(
      { chaveAcesso: chaveAcesso.trim() },
      {
        onSuccess: (data) => {
          toast.success('Nota fiscal consultada com sucesso!');
          setViewingNotaFiscal(data);
          setConsultingEntry(false);
          setChaveAcesso('');
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || 'Erro ao consultar nota fiscal por chave de acesso';
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xml')) {
        toast.error('Por favor, selecione um arquivo XML válido');
        return;
      }
      setXmlFile(file);
    }
  };

  const handleConsultarXml = async () => {
    if (!xmlFile) {
      toast.error('Selecione um arquivo XML');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const xmlBase64 = base64.split(',')[1]; // Remove data:text/xml;base64, prefix

      consultarPorXml(
        { lojaId, xmlBase64 },
        {
          onSuccess: (data) => {
            toast.success('Nota fiscal consultada com sucesso!');
            setViewingNotaFiscal(data);
            setConsultingEntry(false);
            setXmlFile(null);
          },
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message || 'Erro ao consultar nota fiscal por XML';
            toast.error(errorMessage);
          },
        }
      );
    };
    reader.readAsDataURL(xmlFile);
  };

  const handleClose = () => {
    setConsultingEntry(false);
    setChaveAcesso('');
    setXmlFile(null);
  };

  return (
    <Dialog open={consultingEntry} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle>Entrada pela chave de acesso</DialogTitle>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Chave de Acesso Input */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Informe a chave de acesso</h3>
            <div className="flex flex-col gap-2">
              <FloatingInput
                id="chaveAcesso"
                value={chaveAcesso}
                onChange={(e) => setChaveAcesso(e.target.value)}
                label="Chave de acesso"
                className="rounded-md font-mono"
                maxLength={44}
                placeholder="Digite a chave de 44 dígitos"
              />
              <span className="text-xs text-muted-foreground">
                {chaveAcesso.length}/44 caracteres
              </span>
            </div>
          </div>

          <Separator />

          {/* XML Upload */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Carregar pelo XML</h3>
            <div className="flex flex-col gap-2">
              <Label htmlFor="xml-upload" className="text-sm text-muted-foreground">
                Selecione o arquivo XML da nota fiscal
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="xml-upload"
                  type="file"
                  accept=".xml"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {xmlFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setXmlFile(null)}
                    className="text-red-500"
                  >
                    Remover
                  </Button>
                )}
              </div>
              {xmlFile && (
                <span className="text-xs text-muted-foreground">
                  Arquivo selecionado: {xmlFile.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleConsultarChave}
              disabled={isPendingChave || isPendingXml || !chaveAcesso}
              className="w-full sm:w-auto"
            >
              {isPendingChave ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                'Consultar Chave'
              )}
            </Button>

            <Button
              onClick={handleConsultarXml}
              disabled={isPendingChave || isPendingXml || !xmlFile}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {isPendingXml ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar XML
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
