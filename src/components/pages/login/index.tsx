import * as React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
  Label,
  Separator,
} from "@/components/atoms";
import { useSignUp } from "@/services/auth";

export default function Login() {
  const { mutateAsync: signUp, isPending: isSignUpLoading } = useSignUp();
  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
    } catch (error) {}
  }

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Bem-vindo à oficina
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Entre com a sua conta ou crie uma nova.
          </p>

          <Tabs defaultValue="login" className="mt-8">
            <div className="flex items-center justify-center">
              <TabsList className="grid w-[260px] grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>

                <Button type="submit" className="w-full h-11">
                  Entrar
                </Button>

                <div className="relative py-2">
                  <Separator />
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="r-email">Email</Label>
                  <Input
                    id="r-email"
                    type="email"
                    placeholder="m@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="r-password">Senha</Label>
                  <Input id="r-password" type="password" />
                </div>

                <div>
                  <span>Dados da loja</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="r-password">Nome</Label>
                  <Input type="text" />
                </div>

                <div className="flex gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="r-password">Estado</Label>
                    <Input type="text" />
                  </div>{" "}
                  <div className="space-y-2">
                    <Label htmlFor="r-password">Cidade</Label>
                    <Input type="text" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="r-password">Número</Label>
                    <Input type="text" />
                  </div>{" "}
                  <div className="space-y-2">
                    <Label htmlFor="r-password">Cep</Label>
                    <Input type="text" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="r-password">Telefone</Label>
                    <Input type="text" />
                  </div>{" "}
                  <div className="space-y-2">
                    <Label htmlFor="r-password">Telefone secundário</Label>
                    <Input type="text" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11">
                  Criar conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-500 dark:from-zinc-800 dark:via-zinc-900 dark:to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(transparent_0,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-40 w-40 rounded-full border border-white/30 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border border-white/30" />
          </div>
        </div>

        <div className="absolute bottom-10 left-8 right-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow">
            Oficina
          </h2>
          <p className="text-white/90 mt-2 max-w-md">
            DocChat is the easiest way to securely share documents with your
            team. Sign up today to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
