'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

import { LoadingScreen, Message } from '@/components/atoms';
import { Breadcrumbs } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useUsers } from '@/hooks/useUsers';
import { constants } from '@/lib/constants/constants';
import { User } from '@/types/users';
import { Tag } from 'primereact/tag';

const UsersPage = () => {
  const router = useRouter();
  const { data: users, isLoading: loadingUsers, isError: errorUsers } = useUsers();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
    phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  if (loadingUsers) return <LoadingScreen />;
  if (errorUsers)
    return <Message severity="error" summary="Error" detail="Error al cargar los clientes" />;

  const { userRoles, userStatus } = constants;
  const getRoles = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'success';
      case 'Colaborador':
        return 'info';
      case 'Practicante':
        return 'warning';
      default:
        return 'danger';
    }
  };
  const getStatus = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'success';
      case 'Pendiente':
        return 'info';
      case 'Baja':
        return 'warning';
      case 'Inhabilitado':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const roleItemTemplate = (option: string) => {
    return <>{option}</>;
  };

  const roleBodyTemplate = (rowData: User) => {
    return <>{rowData.role && <Tag value={rowData.role} severity={getRoles(rowData.role)} />}</>;
  };

  const roleRowFilterTemplate = (option: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={option.value}
        options={userRoles}
        onChange={(e: DropdownChangeEvent) => option.filterApplyCallback(e.value)}
        itemTemplate={roleItemTemplate}
        placeholder="Seleccionar rol"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusItemTemplate = (option: string) => {
    return <>{option}</>;
  };

  const statusBodyTemplate = (rowData: User) => {
    return (
      <>{rowData.status && <Tag value={rowData.status} severity={getStatus(rowData.status)} />}</>
    );
  };

  const statusRowFilterTemplate = (option: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={option.value}
        options={userStatus}
        onChange={(e: DropdownChangeEvent) => option.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Seleccionar estado"
        className="p-column-filter"
        showClear
      />
    );
  };

  console.log(users);

  return (
    <>
      <Breadcrumbs labels={{ users: 'Usuarios' }} pageTitle="Usuarios" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <DataTable
              value={users}
              paginator
              rows={10}
              dataKey="id"
              filters={filters}
              filterDisplay="row"
              globalFilterFields={['name', 'email', 'role', 'phone', 'status']}
              emptyMessage="No se encontraron usuarios"
              selectionMode="single"
              onRowClick={(e) => router.push(`/users/${e.data.id}`)}
            >
              <Column field="name" header="Nombre" filter filterPlaceholder="Buscar" />
              <Column field="email" header="Email" filter filterPlaceholder="Buscar" />
              <Column
                field="role"
                header="Rol"
                showFilterMenu={false}
                body={roleBodyTemplate}
                filter
                filterElement={roleRowFilterTemplate}
              />
              <Column field="phone" header="Telefono" filter filterPlaceholder="Buscar" />
              <Column
                field="status"
                header="Estado"
                showFilterMenu={false}
                body={statusBodyTemplate}
                filter
                filterElement={statusRowFilterTemplate}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(UsersPage);
