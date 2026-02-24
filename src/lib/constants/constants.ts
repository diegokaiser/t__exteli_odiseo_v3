const gender = ['Masculino', 'Femenino', 'Otro'] as const;
const documentType = ['Pasaporte', 'NIE', 'DNI', 'Otro'] as const;
const status = ['Activo', 'Incompleto', 'Pendiente', 'Finalizado'] as const;
const messenger = ['Sí', 'No'] as const;
const paymentMethods = ['Efectivo', 'Bizum', 'Tarjeta', 'Transferencia bancaria'] as const;
const companyDocumentType = ['CIF', 'NIF', 'NIE'] as const;
const officeLocations = ['Puerto de Balbarán 15'] as const;
const userRoles = ['Administrador', 'Colaborador', 'Practicante'] as const;
const userStatus = ['Activo', 'Pendiente', 'Baja', 'Inhabilitado'] as const;

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
      {
        title: 'Buscar factura',
        href: '/billing/search',
        icon: 'pi pi-search',
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
        href: '/clockify/report',
        icon: 'pi pi-calendar-clock',
      },
      {
        title: 'Ver registros',
        href: '/clockify/records',
        icon: 'pi pi-eye',
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
        href: '/calendar/add',
        icon: 'pi pi-calendar-clock',
      },
    ],
  },
  {
    title: 'Lista de interés',
    items: [
      {
        title: 'Listado',
        href: '/list',
        icon: 'pi pi-users',
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
      /*
      {
        title: 'Agregar nuevo',
        href: '/users/add',
        icon: 'pi pi-user-plus',
      },
      */
      {
        title: 'Actividades',
        href: '/users/activities',
        icon: 'pi pi-chart-bar',
      },
    ],
  },
  {
    title: 'Contabilidad',
    items: [
      {
        title: 'Ingresos',
        href: '/accountability/incomes',
        icon: 'pi pi-chart-line',
      },
      /*
      {
        title: 'Egresos',
        href: '/accountability/outcomings',
        icon: 'pi pi-chart-scatter',
      },
      */
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
      {
        title: 'Alertas',
        href: '/settings/clockify',
        icon: 'pi pi-stopwatch',
      },
      {
        title: 'Trámites',
        href: '/settings/procedures',
        icon: 'pi pi-file-import',
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
  officeLocations,
  paymentMethods,
  sidebarMenu,
  sidebarAdminMenu,
  userRoles,
  userStatus,
};
