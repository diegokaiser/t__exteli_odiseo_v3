const gender = ['Masculino', 'Femenino', 'Otro'] as const;
const documentType = ['Pasaporte', 'NIE', 'DNI', 'Otro'] as const;
const status = ['Activo', 'Incompleto', 'Pendiente', 'Finalizado'] as const;
const messenger = ['Sí', 'No'] as const;
const paymentMethods = ['Efectivo', 'Bizum', 'Tarjeta', 'Transferencia bancaria'] as const;
const companyDocumentType = ['CIF', 'NIF', 'NIE'] as const;

const sidebarMenu = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'pi pi-bolt',
      },
    ],
  },
  {
    title: 'Clientes',
    items: [
      {
        title: 'Listado',
        href: '/customers',
        icon: 'pi pi-users',
      },
      {
        title: 'Registar nuevo',
        href: '/customers/add',
        icon: 'pi pi-user-plus',
      },
    ],
  },
  {
    title: 'Facturación',
    items: [
      {
        title: 'Facturas y recibos',
        href: '/billing',
        icon: 'pi pi-file-excel',
      },
      {
        title: 'Generar',
        href: '/billing/add',
        icon: 'pi pi-file-plus',
      },
    ],
  },
  {
    title: 'Mi tiempo',
    items: [
      {
        title: 'Historial',
        href: '/clockify',
        icon: 'pi pi-clock',
      },
      {
        title: 'Generar Reporte',
        href: '/clockify/new',
        icon: 'pi pi-calendar-clock',
      },
    ],
  },
  {
    title: 'Agenda',
    items: [
      {
        title: 'Administrar citas',
        href: '/calendar',
        icon: 'pi pi-clock',
      },
      {
        title: 'Agregar citas',
        href: '/calendar/new',
        icon: 'pi pi-calendar-clock',
      },
    ],
  },
];

const sidebarAdminMenu = [
  {
    title: 'Usuarios',
    items: [
      {
        title: 'Listado',
        href: '/users',
        icon: 'pi pi-users',
      },
      {
        title: 'Agregar nuevo',
        href: '/users/add',
        icon: 'pi pi-user-plus',
      },
      {
        title: 'Actividades',
        href: '/users/activity',
        icon: 'pi pi-chart-bar',
      },
    ],
  },
  {
    title: 'Contabilidad',
    items: [
      {
        title: 'Ingresos por servicios',
        href: '/accountability/incomings',
        icon: 'pi pi-chart-line',
      },
      {
        title: 'Egresos',
        href: '/accountability/outcomings',
        icon: 'pi pi-chart-scatter',
      },
    ],
  },
  {
    title: 'Configuración',
    items: [
      {
        title: 'Datos empresa',
        href: '/settings/company',
        icon: 'pi pi-cog',
      },
    ],
  },
];

export const constants = {
  companyDocumentType,
  documentType,
  gender,
  status,
  messenger,
  paymentMethods,
  sidebarMenu,
  sidebarAdminMenu,
};
