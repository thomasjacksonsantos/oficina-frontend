import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { redirect, useRouter, useRouterState } from '@tanstack/react-router'
import { z } from 'zod'

import { useAuth } from '../auth'
import { sleep } from '../utils'
import { siApple, siGithub, siGoogle } from 'simple-icons'

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = '/login' as const

export const Route = createFileRoute('/logout')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    // if (context.auth.isAuthenticated) {
    //   throw redirect({ to: search.redirect || fallback })
    // }
  },
  component: LogOutComponet,
})

function LogOutComponet() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleSignOut = async (provider: 'github') => {
    console.log(`Clicked ${provider} sign out!`)
    try {
      const providers = {
        github: new GithubAuthProvider(),
        google: new GoogleAuthProvider(),
        // Other providers can be allocated here
      }

      const typedProvider =
        providers[provider] ??
        (() => {
          throw new Error('Invalid provider')
        })()

      await logout()
      router.navigate({ to: '/dashboard' })
      // router.invalidate() // This should force the user to route to /dashboard
    } catch (error) {
      console.error('SignOut in error:', error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md px-4 animate-fade-up relative z-10">
        <div className="w-full backdrop-blur-xs bg-card/80 p-8 space-y-8 shadow-md border border-border">
          <div className="space-y-4">
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              className="w-full h-12 font-medium bg-background hover:bg-secondary border-2 transition-all hover:scale-[1.02]"
              onClick={() => handleSignOut('github')}
            >
              <div className="flex items-center justify-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                  aria-labelledby="githubIconTitle"
                  role="img"
                  style={{ minWidth: '20px' }}
                >
                  <title id="githubIconTitle">GitHub Logo</title>
                  <path d={siGithub.path} />
                </svg>
                <span>Continue with GitHub</span>
              </div>
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
