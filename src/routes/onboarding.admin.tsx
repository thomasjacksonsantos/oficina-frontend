
import { createFileRoute } from '@tanstack/react-router'
import { Link, redirect } from '@tanstack/react-router'
import { AdminForm } from '@/app/feature/onboarding/index'

export const Route = createFileRoute('/onboarding/admin')({
  beforeLoad: ({ context }) => {
    // Log for debugging
    console.log('Checking context on index.tsx:', context) // Check if user is authenticated
    // if (context.auth.isAuthenticated) {
    //   console.log('User authenticated, proceeding...')
    //   throw redirect({
    //     to: '/dashboard',
    //   })
    // }
  },
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className='flex justify-center items-center'>
      <div className='w-[780px] p-4'>
        <AdminForm  />
      </div>
    </div>
  )
}
