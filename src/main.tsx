import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'


const queryClient = new QueryClient()

import { routeTree } from './routeTree.gen'
import { AuthContextProvider, type AuthContextType, useAuth } from './auth'

import { ThemeProvider } from './components/themes/theme-provider'
import './styles.css'

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined!, // This will be set after we wrap the app in AuthContextProvider
  },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()

  // If the provider is initially loading, do not render the router
  if (auth.isInitialLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="size-10 rounded-full border-4 border-gray-200 border-t-foreground animate-spin" />
      </div>
    )
  }

  return (
    <RouterProvider router={router} context={{ auth }} /> 
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthContextProvider>
        <InnerApp />
      </AuthContextProvider>
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </QueryClientProvider>
    </React.StrictMode>
  )
}
