import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { useAuth } from '../auth'
import { useRouter } from '@tanstack/react-router'
import { GithubAuthProvider, GoogleAuthProvider, User } from "firebase/auth"

export function NavUser({
  user
}: any) {
  const router = useRouter()
  const { isMobile } = useSidebar()
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar || undefined} alt={user.name || undefined} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name || undefined}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email || undefined}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || undefined} alt={user.name || undefined} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name || undefined}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email || undefined}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="pl-0">
              <Button 
                variant={"ghost"} 
                onClick={() => handleSignOut('github')}
              >
                <IconLogout />
                Sair
              </Button>              
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}