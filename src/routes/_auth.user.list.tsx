// src/routes/_auth.customer.list.tsx
import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { UserList, UserColumns } from "@/app/feature/users";


export const Route = createFileRoute('/_auth/user/list')({
  component: CustomerListPage,
})

function CustomerListPage() {

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader text="Clientes"/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-6 md:gap-6">
                <UserList 
                  columns={UserColumns}
                />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}