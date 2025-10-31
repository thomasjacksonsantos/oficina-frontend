import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { Separator } from "@/components/ui/separator";
import { Search, Info, Phone, CreditCard } from "lucide-react";

export default function NewServiceOrderHorizontal() {
  const [balcao, setBalcao] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-screen-sm p-4 md:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="w-full text-xl font-bold">Nova ordem de serviço</h1>
      </div>

      <div>
        <form className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="codigo" /* className="md:w-44 text-xs md:text-sm" */
              >
                Código
              </Label>
              <Input id="codigo" disabled placeholder="—" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="inicio">Início</Label>
              <Input id="inicio" type="datetime-local" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fim" className="md:w-44 text-xs md:text-sm">
                Fim
              </Label>
              <Input id="fim" type="datetime-local" />
            </div>  

            <div className="flex flex-col gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Textarea id="nome" placeholder="Digite suas observações aqui..." />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="balcao"
                checked={balcao}
                onCheckedChange={(v) => setBalcao(Boolean(v))}
              />
              <Label htmlFor="balcao" className="font-normal">
                Venda Balcão?
              </Label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="placa">Placa</Label>
              <div className="flex w-full gap-2">
                <Input id="placa" />
                <Button
                  type="button"
                  variant="secondary"
                  aria-label="Buscar placa"
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="veiculo">Veículo</Label>
              <div className="flex w-full gap-2">
                <Input id="veiculo" />
                <Button
                  type="button"
                  variant="secondary"
                  aria-label="Buscar veículo"
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hodometro">Hodômetro</Label>
              <Input id="hodometro" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ano">Ano</Label>
              <Input id="ano" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cliente">Cliente</Label>
              <div className="flex w-full gap-2">
                <Input id="cliente" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Documento</Label>
              <div className="flex w-full gap-2">
                <Input placeholder="000.000.000-00" />
                <Button
                  type="button"
                  variant="secondary"
                  aria-label="Buscar documento"
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Responsável</Label>
              <div className="flex w-full gap-2">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent align="start">
                    <SelectItem value="1">Fulano</SelectItem>
                    <SelectItem value="2">Beltrano</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="secondary"
                  aria-label="Buscar documento"
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Pesquisa</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="emergencial">Emergencial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="aberta">Aberta</SelectItem>
                  <SelectItem value="andamento">Em andamento</SelectItem>
                  <SelectItem value="fechada">Fechada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="prev">Previsão</Label>
              <Input id="prev" type="date" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hora">Hora</Label>
              <Input id="hora" type="time" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="obs"
              className="md:w-44 text-xs md:text-sm pt-2 md:pt-1"
            >
              Observação
            </Label>
            <Textarea id="obs" rows={4} className="w-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border">
              <div className="rounded-t-md border-b bg-muted/40 px-3 py-2 text-sm font-semibold">
                Crédito
              </div>
              <div className="flex items-center justify-center gap-2 p-6 text-muted-foreground">
                <CreditCard className="h-5 w-5" />
                <span className="text-sm">R$ 0,00</span>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="rounded-t-md border-b bg-muted/40 px-3 py-2 text-sm font-semibold">
                Telefones do Cliente
              </div>
              <div className="flex items-center justify-center gap-2 p-6 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span className="text-sm">—</span>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="rounded-t-md border-b bg-muted/40 px-3 py-2 text-sm font-semibold">
              Observações do Cliente
            </div>
            <div className="flex items-center justify-center gap-2 p-6 text-muted-foreground">
              <Info className="h-5 w-5" />
              <span className="text-sm">Sem observações</span>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-end gap-2">
            <Button variant="secondary">Cancelar</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
