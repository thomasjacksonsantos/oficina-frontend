import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

type Vehicle = {
  nome: string;
  montadora: string;
  tipo: "Carro" | "Caminhão/Ônibus";
};

const MONTADORAS = ["TOYOTA", "VOLKSWAGEN", "FIAT", "FORD", "CHEVROLET"];
const TIPOS: Vehicle["tipo"][] = ["Carro", "Caminhão/Ônibus"];

const SEED: Vehicle[] = [
  { nome: "HILUX", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX SRV", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX SW4", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX SRX", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX CD 4X4 SRV", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX 3.0", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX CAB DUP", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX CAB DUP SR", montadora: "TOYOTA", tipo: "Caminhão/Ônibus" },
  { nome: "HILUX CD/STD SR 2.7", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "PICAPE HILUX 4X4", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX CS DLX", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX CS", montadora: "TOYOTA", tipo: "Carro" },
  { nome: "HILUX 4X4 2.8", montadora: "TOYOTA", tipo: "Carro" },
];

type VehicleSearchDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (vehicle: Vehicle) => void;
};

export default function VehicleSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: VehicleSearchDialogProps) {
  const [descricao, setDescricao] = React.useState("HILUX");
  const [montadora, setMontadora] = React.useState<string | undefined>();
  const [tipo, setTipo] = React.useState<Vehicle["tipo"] | undefined>(); // <- separate filter

  const [rows, setRows] = React.useState<Vehicle[]>(SEED);

  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const selectedVehicle =
    selectedIndex !== null
      ? filtered(rows, descricao, montadora, tipo)[selectedIndex]
      : null;

  const filteredRows = React.useMemo(
    () => filtered(rows, descricao, montadora, tipo),
    [rows, descricao, montadora, tipo]
  );

  React.useEffect(() => {
    setSelectedIndex(null);
  }, [descricao, montadora, tipo]);

  function handleRowClick(idx: number) {
    setSelectedIndex(idx);
  }

  function handleRowDoubleClick(idx: number) {
    setSelectedIndex(idx);
    const v = filteredRows[idx];
    if (v) {
      onSelect?.(v);
      onOpenChange(false);
    }
  }

  function handleSelectButton() {
    if (!selectedVehicle) return;
    onSelect?.(selectedVehicle);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button aria-label="Buscar Veículos">
          <Search size={16} />
        </Button>
      </DialogTrigger>

      <DialogDescription className="hidden">
        Buscar e selecionar veículo
      </DialogDescription>

      <DialogContent
        className="max-w-[860px] p-0 overflow-hidden"
        aria-describedby={undefined}
      >
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-base font-semibold">
            Buscar Veículos
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-2 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Descrição</Label>
              <Input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite a descrição"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Montadora</Label>
              <Select value={montadora} onValueChange={setMontadora}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent align="start">
                  {MONTADORAS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(v) => setTipo(v as Vehicle["tipo"])}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent align="start">
                  {TIPOS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            Resultado: {filteredRows.length} registro(s)
          </div>
        </div>

        <div className="px-4 pt-3">
          <div className="border rounded-md">
            <ScrollArea className="h-[320px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[50%]">Nome</TableHead>
                    <TableHead className="w-[25%]">Montadora</TableHead>
                    <TableHead className="w-[25%]">Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((v, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                      <TableRow
                        key={`${v.nome}-${i}`}
                        onClick={() => handleRowClick(i)}
                        onDoubleClick={() => handleRowDoubleClick(i)}
                        aria-selected={isSelected}
                        className={`cursor-pointer ${
                          isSelected ? "bg-primary/10" : ""
                        }`}
                      >
                        <TableCell className="">{v.nome}</TableCell>
                        <TableCell>{v.montadora}</TableCell>
                        <TableCell>{v.tipo}</TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        Nenhum veículo encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>

        <div className="px-4 pb-4 pt-3 gap-2 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handleSelectButton} disabled={!selectedVehicle}>
            Selecionar Veículo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Helpers **/
function filtered(
  rows: Vehicle[],
  descricao?: string,
  montadora?: string,
  tipo?: Vehicle["tipo"]
) {
  const desc = (descricao ?? "").trim().toLowerCase();
  return rows.filter((r) => {
    const byDesc = !desc || r.nome.toLowerCase().includes(desc);
    const byMont = !montadora || r.montadora === montadora;
    const byTipo = !tipo || r.tipo === tipo;
    return byDesc && byMont && byTipo;
  });
}
