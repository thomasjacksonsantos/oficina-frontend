"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Search, ChevronDown, ChevronUp, List, ArrowUp, Plus, Trash2, Pencil, Link, Router } from "lucide-react"
import { cn } from "@/lib/utils"
import { Route, useRouter } from "@tanstack/react-router"

interface ServiceOrderFormProps {
  serviceOrderId?: number
  initialData?: {
    inicio?: string
    fim?: string
    cliente?: {
      nome?: string
      documento?: string
      telefone?: string
    }
    veiculo?: {
      placa?: string
      nome?: string
      ano?: string
      hodometro?: string
    }
    responsavel?: string
    previsao?: string
    hora?: string
    produtos?: Array<{
      id?: number
      descricao?: string
      quantidade?: number
      valorUnitario?: number
      valorTotal?: number
    }>
  }
}

export default function ServiceOrderForm({
  serviceOrderId = 1,
  initialData
}: ServiceOrderFormProps) {
  const router = useRouter()

  const [clientDetailsOpen, setClientDetailsOpen] = React.useState(false)
  const [vehicleDetailsOpen, setVehicleDetailsOpen] = React.useState(false)
  const [productDialogOpen, setProductDialogOpen] = React.useState(false)
  const [productSearch, setProductSearch] = React.useState("")
  // New menu & lookups
  const [menuDialogOpen, setMenuDialogOpen] = React.useState(false)
  const [customerLookupOpen, setCustomerLookupOpen] = React.useState(false)
  const [vehicleLookupOpen, setVehicleLookupOpen] = React.useState(false)

  // Client details modal state
  const [clientDetailsModalOpen, setClientDetailsModalOpen] = React.useState(false)
  const [clientDetailsForm, setClientDetailsForm] = React.useState({
    nome: "",
    cpfCnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
  })

  // Vehicle details modal state
  const [vehicleDetailsModalOpen, setVehicleDetailsModalOpen] = React.useState(false)
  const [editingVehicleId, setEditingVehicleId] = React.useState<number | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
  const [vehiclePendingDeleteId, setVehiclePendingDeleteId] = React.useState<number | null>(null)
  const [vehicles, setVehicles] = React.useState([
    { id: 1, carro: "Teste", modelo: "Fusca", cor: "branco" },
    { id: 2, carro: "Teste", modelo: "Volkswagem", cor: "preto" },
    { id: 3, carro: "Teste", modelo: "Fiat", cor: "cinza" },
    { id: 4, carro: "Teste", modelo: "Chevrolet", cor: "azul" },
  ])

  // Phones list for client details modal
  const [phones, setPhones] = React.useState<Array<{ id: number; tipo: string; numero: string }>>([
    { id: 1, tipo: "Celular", numero: "" },
    { id: 2, tipo: "Resid", numero: "" },
  ])

  // Sorting state for products table
  const [productsSortField, setProductsSortField] = React.useState<string | null>(null)
  const [productsSortDirection, setProductsSortDirection] = React.useState<"asc" | "desc">("asc")

  // Sorting state for product search dialog table
  const [productSearchSortField, setProductSearchSortField] = React.useState<string | null>(null)
  const [productSearchSortDirection, setProductSearchSortDirection] = React.useState<"asc" | "desc">("asc")

  // Client details form state
  const [clientDetails, setClientDetails] = React.useState({
    nome: "",
    cpfCnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
  })

  // Vehicle details form state
  const [vehicleDetails, setVehicleDetails] = React.useState({
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    hodometro: "",
  })

  // Vehicle list state
  const [vehicleList, setVehicleList] = React.useState([
    { id: 1, carro: "Teste", modelo: "Fusca", cor: "branco" },
    { id: 2, carro: "Teste", modelo: "Volkswagem", cor: "preto" },
    { id: 3, carro: "Teste", modelo: "Fiat", cor: "cinza" },
    { id: 4, carro: "Teste", modelo: "Chevrolet", cor: "azul" },
  ])

  // Sorting state for vehicle list table
  const [vehicleListSortField, setVehicleListSortField] = React.useState<string | null>(null)
  const [vehicleListSortDirection, setVehicleListSortDirection] = React.useState<"asc" | "desc">("asc")

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const [formData, setFormData] = React.useState({
    inicio: initialData?.inicio || "2025-10-27",
    fim: initialData?.fim || "2025-10-27",
    clienteNome: initialData?.cliente?.nome || "",
    clienteDocumento: initialData?.cliente?.documento || "",
    clienteTelefone: initialData?.cliente?.telefone || "",
    veiculoPlaca: initialData?.veiculo?.placa || "",
    veiculoNome: initialData?.veiculo?.nome || "",
    veiculoAno: initialData?.veiculo?.ano || "",
    veiculoHodometro: initialData?.veiculo?.hodometro || "",
    responsavel: initialData?.responsavel || "",
    previsao: initialData?.previsao || "",
    hora: initialData?.hora || "",
  })

  const [produtos, setProdutos] = React.useState(
    initialData?.produtos || [
      {
        id: 1,
        descricao: "Troca de óleo motor",
        quantidade: 1,
        valorUnitario: 120.00,
        valorTotal: 120.00,
      },
      {
        id: 2,
        descricao: "Filtro de óleo",
        quantidade: 1,
        valorUnitario: 35.50,
        valorTotal: 35.50,
      },
      {
        id: 3,
        descricao: "Pastilhas de freio dianteiro",
        quantidade: 2,
        valorUnitario: 85.00,
        valorTotal: 170.00,
      },
      {
        id: 4,
        descricao: "Lavagem completa",
        quantidade: 1,
        valorUnitario: 50.00,
        valorTotal: 50.00,
      },
      {
        id: 5,
        descricao: "Alinhamento e balanceamento",
        quantidade: 1,
        valorUnitario: 150.00,
        valorTotal: 150.00,
      },
    ]
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const totalAmount = produtos.reduce(
    (sum, produto) => sum + (produto.valorTotal || 0),
    0
  )

  // Sort function for products
  const sortProducts = <T extends Record<string, any>>(
    items: T[],
    field: string | null,
    direction: "asc" | "desc"
  ): T[] => {
    if (!field) return items

    return [...items].sort((a, b) => {
      let aValue = a[field]
      let bValue = b[field]

      // Handle null/undefined values
      if (aValue == null) aValue = ""
      if (bValue == null) bValue = ""

      // Convert to strings for comparison if both are not numbers
      if (typeof aValue !== "number" && typeof bValue !== "number") {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1
      if (aValue > bValue) return direction === "asc" ? 1 : -1
      return 0
    })
  }

  // Handle products table sorting
  const handleProductsSort = (field: string) => {
    if (productsSortField === field) {
      // Toggle direction if same field
      setProductsSortDirection(productsSortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field with ascending direction
      setProductsSortField(field)
      setProductsSortDirection("asc")
    }
  }

  // Handle product search dialog table sorting
  const handleProductSearchSort = (field: string) => {
    if (productSearchSortField === field) {
      // Toggle direction if same field
      setProductSearchSortDirection(productSearchSortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field with ascending direction
      setProductSearchSortField(field)
      setProductSearchSortDirection("asc")
    }
  }

  // Sorted products for main table
  const sortedProdutos = React.useMemo(() => {
    return sortProducts(produtos, productsSortField, productsSortDirection)
  }, [produtos, productsSortField, productsSortDirection])

  // Product search data
  type ProductSearchItem = {
    carro: string
    modelo: string
    cor: string
  }

  const allProducts: ProductSearchItem[] = [
    { carro: "Teste", modelo: "Fusca", cor: "branco" },
    { carro: "Teste", modelo: "Volkswagem", cor: "preto" },
    { carro: "Teste", modelo: "Fiat", cor: "cinza" },
    { carro: "Teste", modelo: "Chevrolet", cor: "azul" },
  ]

  const filteredProducts = React.useMemo(() => {
    if (!productSearch.trim()) return allProducts
    const searchLower = productSearch.toLowerCase()
    return allProducts.filter(
      (product) =>
        product.carro.toLowerCase().includes(searchLower) ||
        product.modelo.toLowerCase().includes(searchLower) ||
        product.cor.toLowerCase().includes(searchLower)
    )
  }, [productSearch])

  // Sorted products for search dialog table
  const sortedFilteredProducts = React.useMemo(() => {
    return sortProducts(filteredProducts, productSearchSortField, productSearchSortDirection)
  }, [filteredProducts, productSearchSortField, productSearchSortDirection])

  const handleProductSelect = (product: ProductSearchItem) => {
    // Convert the selected product to a ServiceOrderItem
    const newProduct = {
      id: Date.now(),
      descricao: `${product.carro} ${product.modelo} - ${product.cor}`,
      quantidade: 1,
      valorUnitario: 0,
      valorTotal: 0,
    }
    setProdutos([...produtos, newProduct])
    setProductDialogOpen(false)
    setProductSearch("")
  }

  return (
    <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
      <Card className="rounded-lg">
        <CardContent className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                N OS {serviceOrderId} inicio {formatDate(formData.inicio)} fim {formatDate(formData.fim)}
              </h2>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="Menu"
              onClick={() => setMenuDialogOpen(true)}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Client Information Section */}
          <div className="space-y-3">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cliente-nome">Nome</Label>
                <Input
                  id="cliente-nome"
                  value={formData.clienteNome}
                  onChange={(e) =>
                    setFormData({ ...formData, clienteNome: e.target.value })
                  }
                  placeholder="Nome"
                  className="rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cliente-documento">Cpf/Cnpj</Label>
                <Input
                  id="cliente-documento"
                  value={formData.clienteDocumento}
                  onChange={(e) =>
                    setFormData({ ...formData, clienteDocumento: e.target.value })
                  }
                  placeholder="000.000.000-00"
                  className="rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cliente-telefone">Telefone</Label>
                <div className="flex gap-2">
                  <Input
                    id="cliente-telefone"
                    value={formData.clienteTelefone}
                    onChange={(e) =>
                      setFormData({ ...formData, clienteTelefone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                    className="rounded-md flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-md"
                    aria-label="Buscar cliente"
                    onClick={() => setCustomerLookupOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Client Details Button */}
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
              onClick={() => setClientDetailsModalOpen(true)}
            >
              + dados completo cliente
            </Button>
          </div>

          {/* Client Details Modal */}
          <Dialog open={clientDetailsModalOpen} onOpenChange={setClientDetailsModalOpen}>
            <DialogContent className="max-w-[720px] h-[80vh] overflow-hidden p-0">
              <DialogHeader className="px-4 py-3 border-b">
                <DialogTitle className="text-base font-semibold">Dados completo</DialogTitle>
              </DialogHeader>
              <DialogDescription className="hidden">Informações completas do cliente</DialogDescription>

              {/* Scrollable body */}
              <div className="px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <Label>nome</Label>
                    <Input
                      value={clientDetailsForm.nome}
                      onChange={(e) =>
                        setClientDetailsForm({ ...clientDetailsForm, nome: e.target.value })
                      }
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Endereço</Label>
                    <Input
                      value={clientDetailsForm.endereco}
                      onChange={(e) =>
                        setClientDetailsForm({ ...clientDetailsForm, endereco: e.target.value })
                      }
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Contato</Label>
                  {phones.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <Select
                        value={p.tipo}
                        onValueChange={(v) => {
                          const next = [...phones]
                          next[idx] = { ...next[idx], tipo: v }
                          setPhones(next)
                        }}
                      >
                        <SelectTrigger className="w-32 rounded-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Celular">Celular</SelectItem>
                          <SelectItem value="Resid">Resid</SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={p.numero}
                        onChange={(e) => {
                          const next = [...phones]
                          next[idx] = { ...next[idx], numero: e.target.value }
                          setPhones(next)
                        }}
                        placeholder="(19) 99990-2929"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                  {/* Inline Add phone (left) and Add Veículo (right) */}
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                      onClick={() => setPhones((prev) => [...prev, { id: Date.now(), tipo: "Celular", numero: "" }])}
                    >
                      + Add Telefone
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                      onClick={() => {
                        setEditingVehicleId(null)
                        setVehicleDetails({ placa: "", marca: "", modelo: "", ano: "", cor: "", hodometro: "" })
                        setVehicleDetailsModalOpen(true)
                      }}
                    >
                      | Add Veículo
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-b border-border/40 bg-muted/30">
                        <TableHead className="px-4 py-2">Carro</TableHead>
                        <TableHead className="px-4 py-2">Modelo</TableHead>
                        <TableHead className="px-4 py-2">Cor</TableHead>
                        <TableHead className="px-4 py-2 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles.map((v) => (
                        <TableRow key={v.id} className="border-b border-border/20 bg-card">
                          <TableCell className="px-4 py-2">{v.carro}</TableCell>
                          <TableCell className="px-4 py-2">{v.modelo}</TableCell>
                          <TableCell className="px-4 py-2">{v.cor}</TableCell>
                          <TableCell className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mr-2"
                              onClick={() => {
                                setEditingVehicleId(v.id)
                                setVehicleDetails({
                                  placa: "",
                                  marca: v.carro,
                                  modelo: v.modelo,
                                  ano: "",
                                  cor: v.cor,
                                  hodometro: "",
                                })
                                setVehicleDetailsModalOpen(true)
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => {
                                setVehiclePendingDeleteId(v.id)
                                setConfirmDeleteOpen(true)
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter className="px-4 py-3 border-t">
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="secondary" onClick={() => setClientDetailsModalOpen(false)}>
                    fechar
                  </Button>
                  <Button onClick={() => setClientDetailsModalOpen(false)}>Salvar</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Menu Dialog */}
          <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
            <DialogContent className="max-w-[420px] p-0 overflow-hidden">
              <div className="p-6 grid grid-cols-2 gap-4">
                <Button variant="secondary">Imprimir O.S</Button>
                <Button variant="secondary">Requisicao</Button>
                <Button variant="secondary">Apro/Orcam</Button>
                <Button variant="secondary">Prisma</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Customer Lookup Dialog */}
          <Dialog open={customerLookupOpen} onOpenChange={setCustomerLookupOpen}>
            <DialogContent className="max-w-[720px] p-0 overflow-hidden">
              <DialogHeader className="px-4 py-3 border-b">
                <DialogTitle className="text-base font-semibold">buscar cliente por cpf/cnpj</DialogTitle>
              </DialogHeader>
              <div className="px-4 py-3 border-b space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="buscar cliente por cpf/cnpj" className="flex-1 rounded-md" />
                  <Button type="button" variant="secondary" size="icon" className="h-10 w-10 rounded-md" aria-label="Buscar cliente">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="px-4 py-3 max-h-[380px] overflow-y-auto no-scrollbar">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-border/40 bg-muted/30">
                      <TableHead className="px-4 py-2">Nome</TableHead>
                      <TableHead className="px-4 py-2">Tipo</TableHead>
                      <TableHead className="px-4 py-2">Documento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["CPF", "CNPJ", "CPF", "CNPJ"].map((tipo, idx) => (
                      <TableRow key={idx} className="border-b border-border/20 bg-card">
                        <TableCell className="px-4 py-2">Teste</TableCell>
                        <TableCell className="px-4 py-2">{tipo}</TableCell>
                        <TableCell className="px-4 py-2">314.342.343-85</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          {/* Vehicle Lookup Dialog */}
          <Dialog open={vehicleLookupOpen} onOpenChange={setVehicleLookupOpen}>
            <DialogContent className="max-w-[720px] p-0 overflow-hidden">
              <DialogHeader className="px-4 py-3 border-b">
                <DialogTitle className="text-base font-semibold">buscar veiculo por placa</DialogTitle>
              </DialogHeader>
              <div className="px-4 py-3 border-b space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="buscar veiculo por placa" className="flex-1 rounded-md" />
                  <Button type="button" variant="secondary" size="icon" className="h-10 w-10 rounded-md" aria-label="Buscar veiculo">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="px-4 py-3 max-h-[380px] overflow-y-auto no-scrollbar">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-border/40 bg-muted/30">
                      <TableHead className="px-4 py-2">Carro</TableHead>
                      <TableHead className="px-4 py-2">Modelo</TableHead>
                      <TableHead className="px-4 py-2">Cor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { carro: "Teste", modelo: "Fusca", cor: "branco" },
                      { carro: "Teste", modelo: "Volkswagem", cor: "preto" },
                      { carro: "Teste", modelo: "Fiat", cor: "cinza" },
                      { carro: "Teste", modelo: "Chevrolet", cor: "azul" },
                    ].map((v, idx) => (
                      <TableRow key={idx} className="border-b border-border/20 bg-card">
                        <TableCell className="px-4 py-2">{v.carro}</TableCell>
                        <TableCell className="px-4 py-2">{v.modelo}</TableCell>
                        <TableCell className="px-4 py-2">{v.cor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
          {/* Vehicle Simple Modal (Add/Editar) */}
          <Dialog open={vehicleDetailsModalOpen} onOpenChange={setVehicleDetailsModalOpen}>
            <DialogContent className="max-w-[560px] p-0 overflow-hidden">
              <DialogHeader className="px-4 py-3 border-b">
                <DialogTitle className="text-base font-semibold">Veículo</DialogTitle>
              </DialogHeader>
              <DialogDescription className="hidden">Cadastro rápido de veículo</DialogDescription>

              <div className="px-4 py-4 space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <Label>Carro</Label>
                    <Input
                      value={vehicleDetails.marca}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, marca: e.target.value })}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>modelo</Label>
                    <Input
                      value={vehicleDetails.modelo}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, modelo: e.target.value })}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>placa</Label>
                    <Input
                      value={vehicleDetails.placa}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, placa: e.target.value })}
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="px-4 py-3 border-t">
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="secondary" onClick={() => setVehicleDetailsModalOpen(false)}>
                    voltar
                  </Button>
                  <Button
                    onClick={() => {
                      if (editingVehicleId) {
                        setVehicles((prev) =>
                          prev.map((x) =>
                            x.id === editingVehicleId
                              ? { ...x, carro: vehicleDetails.marca || x.carro, modelo: vehicleDetails.modelo || x.modelo }
                              : x,
                          ),
                        )
                      } else {
                        setVehicles((prev) => [
                          ...prev,
                          { id: Date.now(), carro: vehicleDetails.marca || "Teste", modelo: vehicleDetails.modelo || "-", cor: vehicleDetails.cor || "-" },
                        ])
                      }
                      setEditingVehicleId(null)
                      setVehicleDetailsModalOpen(false)
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Confirm Delete Dialog */}
          <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
            <DialogContent className="max-w-[220px] p-0 overflow-hidden">
              <div className="px-5 py-6 text-center">
                <p className="text-base font-semibold">Deseja realmente deletar ?</p>
              </div>
              <div className="px-5 pb-5 flex items-center gap-2 ml-auto justify-end">
                <Button variant="secondary" onClick={() => setConfirmDeleteOpen(false)}>
                  voltar
                </Button>
                <Button
                  onClick={() => {
                    if (vehiclePendingDeleteId) {
                      setVehicles((prev) => prev.filter((x) => x.id !== vehiclePendingDeleteId))
                    }
                    setVehiclePendingDeleteId(null)
                    setConfirmDeleteOpen(false)
                  }}
                >
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Separator />

          {/* Vehicle Information Section */}
          <div className="space-y-3">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="veiculo-placa">informe a placa</Label>
                <Input
                  id="veiculo-placa"
                  value={formData.veiculoPlaca}
                  onChange={(e) =>
                    setFormData({ ...formData, veiculoPlaca: e.target.value })
                  }
                  placeholder="ABC-1234"
                  className="rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="veiculo-nome">veiculo</Label>
                <Input
                  id="veiculo-nome"
                  value={formData.veiculoNome}
                  onChange={(e) =>
                    setFormData({ ...formData, veiculoNome: e.target.value })
                  }
                  placeholder="Nome do veículo"
                  className="rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="veiculo-ano">ano</Label>
                <Input
                  id="veiculo-ano"
                  value={formData.veiculoAno}
                  onChange={(e) =>
                    setFormData({ ...formData, veiculoAno: e.target.value })
                  }
                  placeholder="2024"
                  className="rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="veiculo-hodometro">hodometro</Label>
                <div className="flex gap-2">
                  <Input
                    id="veiculo-hodometro"
                    value={formData.veiculoHodometro}
                    onChange={(e) =>
                      setFormData({ ...formData, veiculoHodometro: e.target.value })
                    }
                    placeholder="000000"
                    className="rounded-md flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-md"
                    aria-label="Buscar veículo"
                    onClick={() => setVehicleLookupOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Vehicle Details Button */}
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
              onClick={() => setVehicleDetailsModalOpen(true)}
            >
              + dados completo veiculo
            </Button>
          </div>

          <Separator />

          {/* Service Details Section */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="responsavel">responsavel</Label>
              <Select
                value={formData.responsavel}
                onValueChange={(value) =>
                  setFormData({ ...formData, responsavel: value })
                }
              >
                <SelectTrigger className="rounded-md">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funcionario1">Funcionário 1</SelectItem>
                  <SelectItem value="funcionario2">Funcionário 2</SelectItem>
                  <SelectItem value="funcionario3">Funcionário 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="previsao">previsão</Label>
              <Input
                id="previsao"
                type="date"
                value={formData.previsao}
                onChange={(e) =>
                  setFormData({ ...formData, previsao: e.target.value })
                }
                className="rounded-md"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="hora">hora</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) =>
                  setFormData({ ...formData, hora: e.target.value })
                }
                className="rounded-md"
              />
            </div>
          </div>

          <Separator />

          {/* Products Section */}
          <div className="space-y-2 border-1 rounded-md">
            <div className="flex items-center pl-2 pt-2">
              <h3 className="text-base font-semibold">Produtos</h3>
            </div>
            <Separator />
            <div className="min-h-[300px] rounded-md relative">
              {produtos.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">Nenhum produto adicionado</p>
                </div>
              ) : (
                <div className="pb-15">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="border-b border-border/40 bg-muted/30 hover:bg-muted/30">
                        <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground">
                          <div
                            className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => handleProductsSort("descricao")}
                          >
                            Descrição
                            {productsSortField === "descricao" ? (
                              <ArrowUp
                                className={cn("h-3.5 w-3.5 text-muted-foreground", {
                                  "rotate-180": productsSortDirection === "desc",
                                })}
                              />
                            ) : (
                              <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/40 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground w-[100px]">
                          <div
                            className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => handleProductsSort("quantidade")}
                          >
                            Quantidade
                            {productsSortField === "quantidade" ? (
                              <ArrowUp
                                className={cn("h-3.5 w-3.5 text-muted-foreground", {
                                  "rotate-180": productsSortDirection === "desc",
                                })}
                              />
                            ) : (
                              <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/40 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right font-semibold text-muted-foreground">
                          <div
                            className="flex items-center justify-end gap-1.5 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => handleProductsSort("valorUnitario")}
                          >
                            Valor Unitário
                            {productsSortField === "valorUnitario" ? (
                              <ArrowUp
                                className={cn("h-3.5 w-3.5 text-muted-foreground", {
                                  "rotate-180": productsSortDirection === "desc",
                                })}
                              />
                            ) : (
                              <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/40 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="px-4 py-3 text-right font-semibold text-muted-foreground">
                          <div
                            className="flex items-center justify-end gap-1.5 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => handleProductsSort("valorTotal")}
                          >
                            Valor Total
                            {productsSortField === "valorTotal" ? (
                              <ArrowUp
                                className={cn("h-3.5 w-3.5 text-muted-foreground", {
                                  "rotate-180": productsSortDirection === "desc",
                                })}
                              />
                            ) : (
                              <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/40 opacity-50" />
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedProdutos.map((produto, index) => (
                        <TableRow
                          key={produto.id || index}
                          className="border-b border-border/20 bg-card hover:bg-muted/20 transition-colors"
                        >
                          <TableCell className="px-4 py-3 text-foreground">
                            {produto.descricao || "Produto"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-muted-foreground">
                            {produto.quantidade || 0}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right text-muted-foreground">
                            {formatCurrency(produto.valorUnitario || 0)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right text-muted-foreground">
                            {formatCurrency(produto.valorTotal || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="border-t border-border/40 bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={3} className="px-4 py-3 font-semibold text-foreground">
                          Total
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right font-semibold text-foreground">
                          {formatCurrency(totalAmount)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="absolute bottom-4 right-4 rounded-md"
                onClick={() => {
                  setProductDialogOpen(true)
                }}
              >
                + Produto
              </Button>
            </div>
          </div>

          {/* Product Search Dialog */}
          <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
            <DialogContent className="max-w-[600px] p-0 overflow-hidden">
              <DialogHeader className="px-4 py-3 border-b">
                <DialogTitle className="text-base font-semibold">
                  buscar produto
                </DialogTitle>
              </DialogHeader>

              <DialogDescription className="hidden">
                Buscar e selecionar produto
              </DialogDescription>

              <div className="px-4 py-3 border-b space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="buscar produto"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="flex-1 rounded-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-md"
                    aria-label="Buscar produto"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="px-4 py-3 max-h-[400px] overflow-y-auto no-scrollbar">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b border-border/40 bg-muted/30 hover:bg-muted/30">
                      <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground">
                        <div
                          className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors"
                          onClick={() => handleProductSearchSort("carro")}
                        >
                          Carro
                          {productSearchSortField === "carro" ? (
                            <ArrowUp
                              className={cn("h-3.5 w-3.5 text-muted-foreground", {
                                "rotate-180": productSearchSortDirection === "desc",
                              })}
                            />
                          ) : (
                            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/40 opacity-50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground">
                        <div
                          className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors"
                          onClick={() => handleProductSearchSort("modelo")}
                        >
                          Modelo
                          {productSearchSortField === "modelo" ? (
                            <ArrowUp
                              className={cn("h-3.5 w-3.5 text-muted-foreground", {
                                "rotate-180": productSearchSortDirection === "desc",
                              })}
                            />
                          ) : (
                            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/40 opacity-50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="px-4 py-3 text-left font-semibold text-muted-foreground">
                        <div
                          className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors"
                          onClick={() => handleProductSearchSort("cor")}
                        >
                          Cor
                          {productSearchSortField === "cor" ? (
                            <ArrowUp
                              className={cn("h-3.5 w-3.5 text-muted-foreground", {
                                "rotate-180": productSearchSortDirection === "desc",
                              })}
                            />
                          ) : (
                            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/40 opacity-50" />
                          )}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedFilteredProducts.length === 0 ? (
                      <TableRow className="border-b border-border/20 bg-card hover:bg-muted/20">
                        <TableCell colSpan={3} className="px-4 py-3 text-center text-muted-foreground">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedFilteredProducts.map((product, index) => (
                        <TableRow
                          key={index}
                          className="border-b border-border/20 bg-card hover:bg-muted/20 cursor-pointer transition-colors"
                          onClick={() => handleProductSelect(product)}
                          onDoubleClick={() => handleProductSelect(product)}
                        >
                          <TableCell className="px-4 py-3 text-foreground">
                            {product.carro}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-muted-foreground">
                            {product.modelo}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-muted-foreground">
                            {product.cor}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="secondary" onClick={() => { router.navigate({ to: "/service-order" }) }}>
              cancelar
            </Button>
            <Button onClick={() => { }}>Salvar O.S</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

