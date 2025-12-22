const sidebarMenu = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'pi pi-bolt'
      },
    ]
  },
  {
    title: 'Clientes',
    items: [
      {
        title: 'Listado',
        href: '/dashboard/customers',
        icon: 'pi pi-users',
      },
      {
        title: 'Registar nuevo',
        href: '/dashboard/customers/add',
        icon: 'pi pi-user-plus',
      },
    ]
  },
  {
    title: 'Facturación',
    items: [
      {
        title: 'Facturas y recibos',
        href: '/dashboard/billing',
        icon: 'pi pi-file-excel',
      },
      {
        title: 'Generar',
        href: '/dashboard/billing/new',
        icon: 'pi pi-file-plus',
      },
    ]
  },
  {
    title: 'Mi tiempo',
    items: [
      {
        title: 'Historial',
        href: '/dashboard/clockify',
        icon: 'pi pi-clock',
      },
      {
        title: 'Generar Reporte',
        href: '/dashboard/clockify/new',
        icon: 'pi pi-calendar-clock',
      },
    ]
  },
  {
    title: 'Agenda',
    items: [
      {
        title: 'Administrar citas',
        href: '/dashboard/calendar',
        icon: 'pi pi-clock',
      },
      {
        title: 'Agregar citas',
        href: '/dashboard/calendar/new',
        icon: 'pi pi-calendar-clock',
      },
    ]
  },
]

const sidebarAdminMenu = [
  {
    title: 'Usuarios',
    items: [
      {
        title: 'Listado',
        href: '/dashboard/users',
        icon: 'pi pi-users'
      },
      {
        title: 'Agregar nuevo',
        href: '/dashboard/users/add',
        icon: 'pi pi-user-plus'
      },
      {
        title: 'Actividades',
        href: '/dashboard/users/activity',
        icon: 'pi pi-chart-bar'
      }
    ]
  },
  {
    title: 'Contabilidad',
    items: [
      {
        title: 'Ingresos por servicios',
        href: '/dashboard/accountability/incomings',
        icon: 'pi pi-chart-line'
      },
      {
        title: 'Egresos',
        href: '/dashboard/accountability/outcomings',
        icon: 'pi pi-chart-scatter'
      }
    ]
  },
  {
    title: 'Configuración',
    items: [
      {
        title: 'Datos empresa',
        href: '/dashboard/settings/company',
        icon: 'pi pi-cog'
      }
    ]
  }
]

export const constants = {
  sidebarMenu,
  sidebarAdminMenu
}
