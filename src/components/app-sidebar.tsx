'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useLocation, Link } from '@tanstack/react-router';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  User,
  ChevronRight,
} from 'lucide-react';
import { IconDashboard } from '@tabler/icons-react';

import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuCollapsible,
  useSidebar,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      id: 'inicio',
      title: 'Inicio',
      url: '#',
      icon: IconDashboard,
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/',
        },
      ],
    },
    {
      id: 'dados',
      title: 'Dados',
      url: '#',
      icon: User,
      items: [
        {
          title: 'Clientes',
          url: '/customer',
        },
        {
          title: 'Veículos',
          url: '/veiculos',
        },
        {
          title: 'Loja',
          url: '/loja',
        },
      ],
    },
    {
      id: 'operacoes',
      title: 'Operações',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Orçamentos',
          url: '/orcamento',
        },
        {
          title: 'Ordem de Serviço',
          url: '/service-order',
        },
        {
          title: 'Nota de Produto (NF-e)',
          url: '/nota-produto-nfe',
        },
        {
          title: 'Nota de Servico (Municipal)',
          url: '/nota-servico-municipal',
        },
        {
          title: 'Cupom Fiscal (NCF-e)',
          url: '/cupom-fiscal-ncfe',
        },
        {
          title: 'Envio para Contabilidade',
          url: '/envio-contabilidade',
        },
      ],
    },
    {
      id: 'estoque',
      title: 'Estoque',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Fornecedores',
          url: '/fornecedores',
        },
        {
          title: 'Grupos de Produtos',
          url: '/grupos-produtos',
        },
        {
          title: 'Áreas de Produtos',
          url: '/areas-produtos',
        },
        {
          title: 'Unidades do Produtos',
          url: '/unidades-produtos',
        },
        {
          title: 'Marcas de Produtos',
          url: '/marcas-produtos',
        },
        {
          title: 'Status do Pedido de Compra',
          url: '/status-pedido-compra',
        },
      ],
    },
    {
      id: 'gestao-de-estoque',
      title: 'Gestão de Estoque',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Produtos e Serviços',
          url: '/produtos-servicos',
        },
        {
          title: 'Entrada Manual',
          url: '/entrada-manual',
        },
        {
          title: 'Entrada por Chave de Acesso',
          url: '/entrada-por-nfe',
        },
        {
          title: 'Correção de Estoque',
          url: '/correcao-estoque',
        },
        {
          title: 'Auditoria de Estoque',
          url: '/auditoria-estoque',
        },
        {
          title: 'Devolução e Garantia',
          url: '/devolucao-garantia',
        },
        {
          title: 'Transferência entre Lojas',
          url: '/transferencia-entre-lojas',
        },
      ],
    },
    {
      id: 'financeiro',
      title: 'Financeiro',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Contas a Pagar',
          url: '/contas-pagar',
        },
        {
          title: 'Pagamento em Lote',
          url: '/pagamento-em-lote',
        },
        {
          title: 'Contas a Receber',
          url: '/contas-receber',
        },
      ],
    },
    {
      id: 'pagamentos-cartao',
      title: 'Pagamentos Cartão',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Receber ou Antecipar Pagamento',
          url: '/receber-antecipar-pagamento',
        },
        {
          title: 'Consulta de Cartões',
          url: '/consulta-cartoes',
        },
        {
          title: 'Forma de Pagamento',
          url: '/forma-pagamento',
        },
        {
          title: 'Conta Corrente',
          url: '/conta-corrente',
        },
        {
          title: 'Planos de Conta',
          url: '/planos-conta',
        },
        {
          title: 'Bandeira Cartão',
          url: '/bandeira-cartao',
        },
      ],
    },
    {
      id: 'colaboradores',
      title: 'Colaboradores',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Funcionários',
          url: '/funcionarios',
        },
        {
          title: 'Função',
          url: '/funcao-de-comissao',
        },
        {
          title: 'Evento',
          url: '/evento',
        },
        {
          title: 'Exames',
          url: '/exames',
        },
      ],
    },
    {
      id: 'comissoes',
      title: 'Comissões',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Calculo por Consultor',
          url: '/calculo-por-consultor',
        },
        {
          title: 'Calculo por Responsável',
          url: '/calculo-por-responsavel',
        },
        {
          title: 'Parametrizacao por Grupo x Consultar',
          url: '/parametrizacao-por-grupo-x-consultar',
        },
        {
          title: 'Parametrizacao por Grupo x Responsável',
          url: '/parametrizacao-por-grupo-x-responsavel',
        },
        {
          title: 'Parametrizacao por Produto x Consultor',
          url: '/parametrizacao-por-produto-x-consultor',
        },
      ],
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Monitor SEFAZ (DF-e)',
          url: '/monitor-sefaz-dfe',
        },
        {
          title: 'D.R.E. Mensal',
          url: '/dre-mensal',
        },
        {
          title: 'D.R.E. Anual',
          url: '/dre-anual',
        },
        {
          title: 'Ponto de Equilibrio',
          url: '/ponto-de-equilibrio',
        },
        {
          title: 'D.R.F. Mensal',
          url: '/drf-mensal',
        },
        {
          title: 'Relatórios de Rede',
          url: '/relatorios-rede',
        },
      ],
    },
  ],
};

// Helper function to check if a menu item is active
function isMenuActive(menuItem: (typeof data.navMain)[0], currentPath: string): boolean {
  if (menuItem.items) {
    return menuItem.items.some((item) => item.url === currentPath);
  }
  return false;
}

// Component that automatically expands parent menus based on current route
function SidebarMenuManager() {
  const location = useLocation();
  const { setMenuOpen } = useSidebar();

  useEffect(() => {
    // Auto-expand parent menu when route matches a submenu item
    data.navMain.forEach((item) => {
      if (item.items && isMenuActive(item, location.pathname)) {
        setMenuOpen(item.id, true);
      }
    });
  }, [location.pathname, setMenuOpen]);

  return null;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { toggleMenu, openMenus } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarMenuManager />

      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.items && item.items.length > 0;
              const isOpen = openMenus.has(item.id);

              if (!hasSubItems) {
                // Simple menu item without submenu (shouldn't happen in this case)
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        <Icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              // Menu item with collapsible submenu
              return (
                <SidebarMenuCollapsible key={item.id} menuId={item.id}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleMenu(item.id)}
                      isActive={isMenuActive(item, location.pathname)}
                    >
                      <Icon />
                      {item.title}
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-transform ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </SidebarMenuButton>

                    {isOpen && (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.url}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname === subItem.url}
                              className="block max-w-full truncate"
                            >
                              <Link to={subItem.url} className='py-1 px-2'>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </SidebarMenuCollapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
