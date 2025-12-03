"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IconDashboard } from "@tabler/icons-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inicio",
      url: "#",
      icon: IconDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/",
        }
      ],
    },
    {
      title: "Dados",
      url: "#",
      icon: User,
      items: [
        {
          title: "Clientes",
          url: "/customer",
        },
        {
          title: "Veículos",
          url: "/veiculos",
        },
        {
          title: "Loja",
          url: "/loja",
        },
      ],
    },
    {
      title: "Operações",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Orçamentos",
          url: "/orcamento",
        },
        {
          title: "Ordem de Serviço",
          url: "/service-order",
        },
        {
          title: "Nota de Produto (NF-e)",
          url: "/nota-produto-nfe",
        },
        {
          title: "Nota de Servico (Municipal)",
          url: "/nota-servico-municipal",
        },
        {
          title: "Cupom Fiscal (NCF-e)",
          url: "/cupom-fiscal-ncfe",
        },
        {
          title: "Envio para Contabilidade",
          url: "/envio-contabilidade",
        },
      ],
    },
    {
      title: "Estoque",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Fornecedores",
          url: "/fornecedores",
        },
        {
          title: "Grupos de Produtos",
          url: "/grupos-produtos",
        },
        {
          title: "Áreas de Produtos",
          url: "/areas-produtos",
        },
        {
          title: "Unidades do Produtos",
          url: "/unidades-produtos",
        },
        {
          title: "Marcas de Produtos",
          url: "/marcas-produtos",
        },
        {
          title: "Status do Pedido de Compra",
          url: "/status-pedido-compra",
        }
      ],
    },
    {
      title: "Gestão de Estoque",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Produtos e Serviços",
          url: "/produtos-servicos",
        },
        {
          title: "Entrada Manual",
          url: "/entrada-manual",
        },
        {
          title: "Entrada por Chave de Acesso",
          url: "/entrada-por-nfe",
        },
        {
          title: "Correção de Estoque",
          url: "/correcao-estoque",
        },
        {
          title: "Auditoria de Estoque",
          url: "/auditoria-estoque",
        },
        {
          title: "Devolução e Garantia",
          url: "/devolucao-garantia",
        },
        {
          title: "Transferência entre Lojas",
          url: "/transferencia-entre-lojas",
        },
      ],
    },
    {
      title: "Financeiro",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Contas a Pagar",
          url: "/contas-pagar",
        },
        {
          title: "Pagamento em Lote",
          url: "/pagamento-em-lote",
        },
        {
          title: "Contas a Receber",
          url: "/contas-receber",
        },
      ],
    },
    {
      title: "Pagamentos Cartão",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Receber ou Antecipar Pagamento",
          url: "/receber-antecipar-pagamento",
        },
        {
          title: "Consulta de Cartões",
          url: "/consulta-cartoes",
        },
        {
          title: "Forma de Pagamento",
          url: "/forma-pagamento",
        },
        {
          title: "Conta Corrente",
          url: "/conta-corrente",
        },
        {
          title: "Planos de Conta",
          url: "/planos-conta",
        },
        {
          title: "Bandeira Cartão",
          url: "/bandeira-cartao",
        },
      ],
    },
    {
      title: "Colaboradores",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Funcionários",
          url: "/funcionarios",
        },
        {
          title: "Função",
          url: "/funcao-de-comissao",
        },
        {
          title: "Evento",
          url: "/evento",
        },
        {
          title: "Exames",
          url: "/exames",
        },
      ],
    },
    {
      title: "Comissões",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Calculo por Consultor",
          url: "/calculo-por-consultor",
        },
        {
          title: "Calculo por Responsável",
          url: "/calculo-por-responsavel",
        },
        {
          title: "Parametrizacao por Grupo x Consultar",
          url: "/parametrizacao-por-grupo-x-consultar",
        },
        {
          title: "Parametrizacao por Grupo x Responsável",
          url: "/parametrizacao-por-grupo-x-responsavel",
        },
        {
          title: "Parametrizacao por Produto x Consultor",
          url: "/parametrizacao-por-produto-x-consultor",
        }
      ],
    },
    {
      title: "Relatórios",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Monitor SEFAZ (DF-e)",
          url: "/monitor-sefaz-dfe",
        },
        {
          title: "D.R.E. Mensal",
          url: "/dre-mensal",
        },
        {
          title: "D.R.E. Anual",
          url: "/dre-anual",
        },
        {
          title: "Ponto de Equilibrio",
          url: "/ponto-de-equilibrio",
        },
        {
          title: "D.R.F. Mensal",
          url: "/drf-mensal",
        },
        {
          title: "Relatórios de Rede",
          url: "/relatorios-rede",
        },
      ],
    },
  ],
  // relatorios: [
  //   {
  //     name: "Relatórios Financeiros",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
