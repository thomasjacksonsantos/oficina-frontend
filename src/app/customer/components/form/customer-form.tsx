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
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { CreateCustomerInput, Customer, Sexo, TipoDocumento } from "@/api/customers.types"
import { useForm } from "react-hook-form"
import { CreateCustomerSchema, customerSchema } from "./customer.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateCustomer } from "@/app/customer/api/use-create-customer"
import { TipoTelefone } from "@/api/contato.types"

export default function CustomerForm() {

  const { isPending, mutate } = useCreateCustomer()

  // Phones list for client details modal
  const [phones, setPhones] = React.useState<Array<{ id: number; tipo: string; numero: string }>>([
    { id: 1, tipo: "Celular", numero: "" },
  ])

  const { register, handleSubmit, formState } = useForm<CreateCustomerSchema>({
    resolver: zodResolver(customerSchema)
  })

  const handleCreateCustomer = (data: any) => {

    alert("Form submitted! Check console for data.")

    console.log("Submitting data:", data)

    // // Transform the form data to match CreateCustomerInput format
    // const create: CreateCustomerInput = {
    //   ...data,
    //   contatos: data.contatos.map(contato => ({
    //     ...contato,
    //     ddd: "" // Add required ddd field - you may want to extract this from the numero field
    //   }))
    // }

    // mutate(create)
  }

  return (
    <div className="mx-auto w-full max-w-5xl py-6">
      <form onSubmit={handleSubmit(handleCreateCustomer)}>
        <Card className="rounded-lg">
          <CardContent className="p-6 space-y-6">

            {/* Client Information Section */}
            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-nome">Nome</Label>
                  <Input
                    id="cliente-nome"
                    {...register("nome")}
                    placeholder="Nome"
                    className="rounded-md"
                  />
                  {formState.errors.nome && (
                    <span className="text-sm text-red-500">
                      {formState.errors.nome.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-razaoSocial">Razão Social</Label>
                  <Input
                    id="cliente-razaoSocial"
                    {...register("razaoSocial")}
                    placeholder="Razão Social"
                    className="rounded-md"
                  />
                  {formState.errors.razaoSocial && (
                    <span className="text-sm text-red-500">
                      {formState.errors.razaoSocial.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-documento">Cpf | Cnpj</Label>
                  <Input
                    id="cliente-documento"
                    {...register("documento")}
                    placeholder="Informe o cpf/cnpj/rg"
                    className="rounded-md"
                  />
                  {formState.errors.documento && (
                    <span className="text-sm text-red-500">
                      {formState.errors.documento.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Contato</Label>
              {phones.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-2">
                  <Select
                    value={p.tipo}
                    onValueChange={(v: TipoTelefone) => {
                      const next = [...phones]
                      next[idx] = { ...next[idx], tipo: v }
                      setPhones(next)
                      register(`contatos.${idx}.tipoTelefone`, v as any)
                    }}
                  >
                    <div className="flex flex-col">
                      <SelectTrigger className="w-32 rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TipoTelefone.Celular}>Celular</SelectItem>
                        <SelectItem value={TipoTelefone.Telefone}>Telefone</SelectItem>
                      </SelectContent>
                      {formState.errors.contatos && formState.errors.contatos[idx] && formState.errors.contatos[idx]?.tipoTelefone && (
                        <span className="text-sm text-red-500">
                          {formState.errors.contatos[idx]?.tipoTelefone?.message}
                        </span>
                      )}
                    </div>
                  </Select>
                  <div className="flex flex-col">
                    <Input
                      className="w-auto"
                      placeholder="(19) 99990-2929"
                      value={p.numero}
                      onChange={(e) => {
                        const next = [...phones]
                        next[idx] = { ...next[idx], numero: e.target.value }
                        setPhones(next)
                      }}
                    />
                    {formState.errors.contatos && formState.errors.contatos[idx] && formState.errors.contatos[idx]?.numero && (
                      <span className="text-sm text-red-500">
                        {formState.errors.contatos[idx]?.numero?.message}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => {
                      const next = phones.filter((_, i) => i !== idx)
                      setPhones(next)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                  onClick={() => setPhones((prev) => [...prev, { id: Date.now(), tipo: "Celular", numero: "" }])}
                >
                  + Add Telefone
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-cep">Cep</Label>
                  <Input
                    id="cliente-cep"
                    {...register("endereco.cep")}
                    placeholder="00000-000"
                    className="w-full sm:w-auto"
                  />
                  {formState.errors.endereco?.cep && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.cep.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  <Button
                    id="cliente-buscar-cep"
                    type="button"
                    className="w-auto"
                  >
                    Buscar Cep
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-logradouro">Logradouro</Label>
                  <Input
                    id="cliente-logradouro"
                    {...register("endereco.logradouro")}
                    placeholder="Informe o logradouro"
                    className="rounded-md"
                  />
                  {formState.errors.endereco?.logradouro && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.logradouro.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-numero">Número</Label>
                  <Input
                    id="cliente-numero"
                    {...register("endereco.numero")}
                    placeholder="Informe o número"
                    className="rounded-md"
                  />
                  {formState.errors.endereco?.numero && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.numero.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-complemento">Complemento</Label>
                  <Input
                    id="cliente-complemento"
                    {...register("endereco.complemento")}
                    placeholder="Informe o complemento"
                    className="rounded-md"
                  />
                  {formState.errors.endereco?.complemento && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.complemento.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-bairro">Bairro</Label>
                  <Input
                    id="cliente-bairro"
                    {...register("endereco.bairro")}
                    placeholder="Informe o bairro"
                    className="rounded-md"
                  />
                  {formState.errors.endereco?.bairro && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.bairro.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-estado">Estado</Label>
                  <Input
                    id="cliente-estado"
                    {...register("endereco.estado")}
                    placeholder="Informe o estado"
                    className="rounded-md"
                  />
                  {formState.errors.endereco?.estado && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.estado.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-cidade">Cidade</Label>
                  <Input
                    id="cliente-cidade"
                    {...register("endereco.cidade")}
                    placeholder="Informe a cidade"
                    className="rounded-md"
                  />
                  {formState.errors.endereco?.cidade && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.cidade.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cliente-pais">País</Label>
                  <Input
                    id="cliente-pais"
                    {...register("endereco.pais")}
                    placeholder="Informe o país"
                    className="rounded-md"
                  />
                  {formState.errors.endereco?.pais && (
                    <span className="text-sm text-red-500">
                      {formState.errors.endereco.pais.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant={"outline"} className="w-auto">Voltar</Button>
            <Button
              type="submit"
              className="w-auto"
            // disabled={isPending}
            >
              {isPending ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

