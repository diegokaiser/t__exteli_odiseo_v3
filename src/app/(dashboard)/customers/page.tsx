'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

import { LoadingScreen, Message } from '@/components/atoms';
import { Breadcrumbs } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useCustomers } from '@/hooks/useCustomer';
import { Customer } from '@/types/customers';
import { dateEnterDate } from '@/utils/dateEnterDate';

const CustomersPage = () => {
  const router = useRouter();
  const { data: customers, isLoading, isError } = useCustomers();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    documentNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    nationality: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    enterDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    agent: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <Message severity="error" summary="Error" detail="Error al cargar los clientes" />;

  const statusOptions = ['Pendiente', 'Activo', 'Incompleto', 'Finalizado'];
  const getSeverity = (statusOptions: string) => {
    switch (statusOptions) {
      case 'Pendiente':
        return 'warning';
      case 'Activo':
        return 'success';
      case 'Incompleto':
        return 'danger';
      case 'Finalizado':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar..."
          />
        </IconField>
      </div>
    );
  };

  const firstNameBodyTemplate = (rowData: Customer) => {
    return <span className="capitalize">{rowData.firstName}</span>;
  };

  const enterDateBodyTemplate = (rowData: Customer) => {
    return <span>{dateEnterDate(rowData.enterDate)}</span>;
  };

  const statusItemTemplate = (option: string) => {
    return <>{option}</>;
  };

  const statusBodyTemplate = (rowData: Customer) => {
    return (
      <>{rowData.status && <Tag value={rowData.status} severity={getSeverity(rowData.status)} />}</>
    );
  };

  const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={statusOptions}
        onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Seleccionar estado"
        className="p-column-filter"
        showClear
      />
    );
  };

  /*
  const agentRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={agents}
        onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
      />
    );
  };
  */

  const header = renderHeader();

  return (
    <>
      <Breadcrumbs labels={{ customers: 'Clientes' }} pageTitle="Clientes" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <DataTable
              value={customers}
              paginator
              rows={10}
              dataKey="id"
              filters={filters}
              filterDisplay="row"
              globalFilterFields={[
                'firstName',
                'documentNumber',
                'phone',
                'nationality',
                'enterDate',
                'agent',
                'status',
              ]}
              header={header}
              emptyMessage="No hay clientes"
              selectionMode="single"
              onRowClick={(e) => router.push(`/customers/${e.data.id}`)}
            >
              <Column
                field="firstName"
                header="Nombre"
                body={firstNameBodyTemplate}
                filter
                filterPlaceholder="Buscar"
              />
              <Column
                field="documentNumber"
                header="DNI"
                showFilterMenu={false}
                filter
                filterPlaceholder="Buscar"
              />
              <Column
                field="phone"
                header="Telefono"
                showFilterMenu={false}
                filter
                filterPlaceholder="Buscar"
              />
              <Column
                field="nationality"
                header="Nacionalidad"
                showFilterMenu={false}
                filter
                filterPlaceholder="Buscar"
              />
              <Column
                field="enterDate"
                header="Fecha de entrada"
                showFilterMenu={false}
                filter
                filterPlaceholder="Buscar"
              />
              <Column
                field="agent"
                header="Agente"
                showFilterMenu={false}
                filter
                filterPlaceholder="Buscar"
              />
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

export default withAuth(CustomersPage);
