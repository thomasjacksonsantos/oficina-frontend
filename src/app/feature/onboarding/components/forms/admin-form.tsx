"use client"

import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"
import {
  Button
} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Input
} from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  PhoneInput
} from "@/components/ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"


const formSchema = z.object({
  nome: z.string().min(1),
  documento: z.string(),
  sexo: z.string(),
  dataNascimento: z.coerce.date(),
  phone: z.string(),
  email: z.string().min(1),
  cep: z.string().min(1),
  logradouro: z.string().min(1),
  numero: z.string().min(1),
  complemento: z.string().min(1),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().min(1),
  pais: z.string().min(1)
});

import { useCreateUser } from "@/app/feature/users/api/use-create-user"

export function AdminForm() {
  const { mutate, data, isPending } = useCreateUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      bairro: "",
      cep: "",
      cidade:"",
      complemento:"",
      dataNascimento: "",
      
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      mutate({
        username: values.username,
        email: "teste@teste.com",
        sex: Sex.MALE,
        birth: "",
        id: "1234567890",
        contact: {
          phones: [{
            typePhone: TypePhone.PHONE,
            number: "1234567890",
            default: true,
          }],
          email: "teste@teste.com",
          site: "https://www.teste.com",
        },
        documents: values.document,
        address: {
          street: "Rua das Flores",
          number: "123",
          complement: "Apto 101",
          neighborhood: "Jardim",
          city: "São Paulo",
          state: "SP",
          country: "BR",
          code: "1234567890",
        }
      })

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{'Sucesso'}</code>
        </pre>
      );

    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto py-10">

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe o nome"

                  type="text"
                  {...field} />
              </FormControl>
              <FormDescription>Informe o nome</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-12 gap-4">
          <div className="sm:col-span-12 col-span-4">
            <FormField
              control={form.control}
              name="typeDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange} defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="tipo Documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@example.com">Cpf</SelectItem>
                      <SelectItem value="m@google.com">Cnpj</SelectItem>
                      <SelectItem value="m@support.com">Rg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Informe</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="sm:col-span-12 col-span-4">
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe o documento"

                      type="text"
                      {...field} />
                  </FormControl>
                  <FormDescription>Informe o documento</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Informe o sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">Masculino</SelectItem>
                  <SelectItem value="m@google.com">Feminino</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Informe o sexo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {field.value ? field.value.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Telefone</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  placeholder="Informe o telefone"
                  {...field}
                  defaultCountry="BR"
                />
              </FormControl>
              <FormDescription>Informe o telefone</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe o email"

                  type="text"
                  {...field} />
              </FormControl>
              <FormDescription>Informe o email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="site"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe o site"

                  type="text"
                  {...field} />
              </FormControl>
              <FormDescription>Informe o site</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cep</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe o cep"

                  type="text"
                  {...field} />
              </FormControl>
              <FormDescription>Informe o cep</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe o logradouro"

                  type="text"
                  {...field} />
              </FormControl>
              <FormDescription>Informe o logradouro</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Numero"

                      type="text"
                      {...field} />
                  </FormControl>
                  <FormDescription>Informe o numero da residencia</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-8">
            <FormField
              control={form.control}
              name="complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe o complemento"

                      type="text"
                      {...field} />
                  </FormControl>
                  <FormDescription>Informe o complemento</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe o bairro"

                  type="text"
                  {...field} />
              </FormControl>
              <FormDescription>Informe o bairro</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informe a cidade"

                  type="text"
                  {...field} />
              </FormControl>
              <FormDescription>Informe a cidade</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">

          <div className="col-span-6">

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe o estado"

                      type="text"
                      {...field} />
                  </FormControl>
                  <FormDescription>Informe o estado</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pais</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Informe o pais"

                      type="text"
                      {...field} />
                  </FormControl>
                  <FormDescription>Informe o pais</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        </div>
        <Button
          type="submit"
        >Submit</Button>
      </form>
    </Form>
  )
}