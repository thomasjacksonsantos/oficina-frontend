import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { ServiceOrderItem } from "@/api/service-orders.types";

type Product = {
  carro: string;
  modelo: string;
  cor: string;
  descricao: string;
  valorUnitario: number;
};

const SEED_PRODUCTS: Product[] = [
  {
    carro: "Teste",
    modelo: "Fusca",
    cor: "branco",
    descricao: "Produto Fusca Branco",
    valorUnitario: 150.00,
  },
  {
    carro: "Teste",
    modelo: "Volkswagem",
    cor: "preto",
    descricao: "Produto Volkswagem Preto",
    valorUnitario: 200.00,
  },
  {
    carro: "Teste",
    modelo: "Fiat",
    cor: "cinza",
    descricao: "Produto Fiat Cinza",
    valorUnitario: 120.00,
  },
  {
    carro: "Teste",
    modelo: "Chevrolet",
    cor: "azul",
    descricao: "Produto Chevrolet Azul",
    valorUnitario: 180.00,
  },
];

type ProductSearchDialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (product: ServiceOrderItem) => void;
};

export default function ProductSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: ProductSearchDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const filteredProducts = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return SEED_PRODUCTS;
    return SEED_PRODUCTS.filter(
      (p) =>
        p.carro.toLowerCase().includes(term) ||
        p.modelo.toLowerCase().includes(term) ||
        p.cor.toLowerCase().includes(term) ||
        p.descricao.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const selectedProduct =
    selectedIndex !== null ? filteredProducts[selectedIndex] : null;

  React.useEffect(() => {
    setSelectedIndex(null);
  }, [searchTerm]);

  function handleRowClick(idx: number) {
    setSelectedIndex(idx);
  }

  function handleRowDoubleClick(idx: number) {
    const product = filteredProducts[idx];
    if (product) {
      handleSelectProduct(product);
    }
  }

  function handleSelectProduct(product: Product) {
    // Convert Product to ServiceOrderItem format
    const serviceOrderItem: ServiceOrderItem = {
      id: Date.now(), // Temporary ID
      descricao: product.descricao,
      quantidade: 1,
      valorUnitario: product.valorUnitario,
      valorTotal: product.valorUnitario,
    };
    onSelect?.(serviceOrderItem);
    onOpenChange(false);
    setSearchTerm("");
    setSelectedIndex(null);
  }

  function handleSelectButton() {
    if (!selectedProduct) return;
    handleSelectProduct(selectedProduct);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogDescription className="hidden">
        Buscar e selecionar produto
      </DialogDescription>

      <DialogContent className="max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-base font-semibold">
            buscar produto
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 border-b">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="buscar produto"
              className="flex-1 h-10"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-10 w-10"
              aria-label="Buscar produto"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-4 pt-3">
          <div className="border rounded-md">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Carro</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Cor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                      <TableRow
                        key={`${product.carro}-${product.modelo}-${product.cor}-${i}`}
                        onClick={() => handleRowClick(i)}
                        onDoubleClick={() => handleRowDoubleClick(i)}
                        aria-selected={isSelected}
                        className={`cursor-pointer ${
                          isSelected ? "bg-primary/10" : ""
                        }`}
                      >
                        <TableCell>{product.carro}</TableCell>
                        <TableCell>{product.modelo}</TableCell>
                        <TableCell>{product.cor}</TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        Nenhum produto encontrado
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
          <Button onClick={handleSelectButton} disabled={!selectedProduct}>
            Selecionar Produto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

