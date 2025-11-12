import { createFileRoute } from "@tanstack/react-router";
import * as React from 'react'
import { redirect, useRouter, useRouterState } from '@tanstack/react-router'
import { z } from 'zod'

import { useAuth } from '@/auth'
import { siApple, siGithub, siGoogle } from 'simple-icons'

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth'

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button
} from "@/components/atoms";
import OnboardingPage from "@/app/account/onboarding/Page";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = '/login' as const

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: () => <LoginComponent />,
});

function LoginComponent() {
  const router = useRouter()
  const { login } = useAuth()

  const handleSignIn = async (provider: 'github' | 'google' | 'apple') => {
    console.log(`Clicked ${provider} sign in!`)
    try {
      const providers = {
        github: new GithubAuthProvider(),
        google: new GoogleAuthProvider(),
        apple: new OAuthProvider('apple.com'),
        // Other providers can be allocated here
      }

      const typedProvider =
        providers[provider] ??
        (() => {
          throw new Error('Invalid provider')
        })()

      await login(typedProvider)
      router.invalidate() // This should force the user to route to /dashboard
    } catch (error) {
      console.error('Sign in error:', error)
    }

  }

  // Componente para ícones SVG
  const SvgIcon = ({ path, ...props }: { path: string } & React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d={path} />
    </svg>
  )

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
              <div className="space-y-4">
                {/* Botões dos provedores OAuth */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 flex items-center justify-center gap-3"
                    onClick={() => handleSignIn('github')}
                  >
                    <SvgIcon
                      path={siGithub.path}
                      className="w-5 h-5"
                    />
                    Continuar com GitHub
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 flex items-center justify-center gap-3"
                    onClick={() => handleSignIn('google')}
                  >
                    <SvgIcon
                      path={siGoogle.path}
                      className="w-5 h-5"
                    />
                    Continuar com Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 flex items-center justify-center gap-3"
                    onClick={() => handleSignIn("apple")}
                  >
                    <SvgIcon
                      path={siApple.path}
                      className="w-5 h-5"
                    />
                    Continuar com Apple
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <OnboardingPage />
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
            DocChat é a forma mais fácil de compartilhar documentos com
            segurança.
          </p>
        </div>
      </div>
    </div>
  )
}

