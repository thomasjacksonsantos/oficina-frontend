import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import data from "./data.json"

export default function Customer() {

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Busca de Pessoa</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <Label>Nome/Fantasia</Label>
              <Input placeholder="Digite o nome ou fantasia" />
            </div>
            <div>
              <Label>Razão Social</Label>
              <Input placeholder="Digite a razão social" />
            </div>
            <div>
              <Label>CPF/CNPJ</Label>
              <Input placeholder="Digite o CPF ou CNPJ" />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input placeholder="(XX) XXXXX-XXXX" />
            </div>
            <div>
              <Label>Período (Data Inicial)</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Data Final</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Situação</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col justify-end gap-2 mt-2">
              <div className="flex items-center gap-3">
                <Checkbox id="cliente" defaultChecked />
                <Label htmlFor="cliente">Cliente</Label>
                <Checkbox id="fornecedor" />
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Checkbox id="funcionario" />
                <Label htmlFor="funcionario">Funcionário</Label>
                <Checkbox id="transportadora" />
                <Label htmlFor="transportadora">Transportadora</Label>
              </div>
            </div>
          </form>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary">Limpar</Button>
            <Button>Buscar</Button>
            <Button variant="outline">Novo Cliente</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />
      <DataTable data={data} />

    </div>
  );
}
