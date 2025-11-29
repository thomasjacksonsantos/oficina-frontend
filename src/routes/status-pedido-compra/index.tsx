import { createFileRoute } from "@tanstack/react-router";
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import OrderStatus from "@/app/product-order-status";

const fallback = '/login' as const

export const Route = createFileRoute("/status-pedido-compra/")({
    validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    console.log('OrderStatus new route beforeLoad called')
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || '/login' })
    }
  },
  component: OrderStatusComponent,
});

function OrderStatusComponent() {
  return (
    <OrderStatus />
  );
}
