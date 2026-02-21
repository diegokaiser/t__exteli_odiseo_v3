'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

import { LoadingScreen, Message } from '@/components/atoms';
import { Breadcrumbs } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useGetCustomers } from '@/hooks/useRegMasCalc';
import { RegMasCalc } from '@/types/regmascalc';

const ListPage = () => {
  const router = useRouter();
  const { data: customers, isLoading, isError } = useGetCustomers();

  const [filters, setFilters] = useState({
    name: { value: '', matchMode: FilterMatchMode.CONTAINS },
    nacionalidad: { value: '', matchMode: FilterMatchMode.CONTAINS },
    email: { value: '', matchMode: FilterMatchMode.CONTAINS },
    phone: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <Message severity="error" summary="Error" detail="Error al cargar los clientes" />;

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

  const situacionBodyTemplate = (rowData: RegMasCalc) => {
    return <span className="capitalize">{rowData.situacion}</span>;
  };

  const nacionalidadBodyTemplate = (rowData: RegMasCalc) => {
    let flag = '';
    switch (rowData.nacionalidad.toLowerCase().trim()) {
      case 'argentina':
        flag = '🇦🇷';
        break;
      case 'uruguay':
        flag = '🇺🇾';
        break;
      case 'brasil':
        flag = '🇧🇷';
        break;
      case 'chile':
        flag = '🇨🇱';
        break;
      case 'paraguay':
        flag = '🇵🇾';
        break;
      case 'bolivia':
        flag = '🇧🇴';
        break;
      case 'peru':
        flag = '🇵🇪';
        break;
      case 'perú':
        flag = '🇵🇪';
        break;
      case 'colombia':
        flag = '🇨🇴';
        break;
      case 'ecuador':
        flag = '🇪🇨';
        break;
      case 'venezuela':
        flag = '🇻🇪';
        break;
      case 'españa':
        flag = '🇪🇸';
        break;
      case 'italia':
        flag = '🇮🇹';
        break;
      case 'francia':
        flag = '🇫🇷';
        break;
      case 'alemania':
        flag = '🇩🇪';
        break;
      case 'reino unido':
        flag = '🇬🇧';
        break;
      case 'estados unidos':
        flag = '🇺🇸';
        break;
      case 'canada':
        flag = '🇨🇦';
        break;
      case 'mexico':
        flag = '🇲🇽';
        break;
    }
    return (
      <>
        <div className="inline-flex items-center gap-x-2">
          <span className="text-[20px]">{flag}</span>
          <span>{rowData.nacionalidad}</span>
          <span className="text-[20px]">{flag}</span>
        </div>
      </>
    );
  };

  const emailBodyTemplate = (rowData: RegMasCalc) => {
    return (
      <a href={`mailto:${rowData.email}`}>
        <div className="bg-[#0ea5e9] inline-flex items-center gap-x-2 rounded-[6px] px-4 py-2">
          <i className="pi pi-envelope text-white"></i>
          <span className="font-bold text-white">{rowData.email}</span>
        </div>
      </a>
    );
  };

  const phoneBodyTemplate = (rowData: RegMasCalc) => {
    return (
      <a href={`tel:${rowData.phone}`}>
        <div className="bg-[#06b6d4] inline-flex items-center gap-x-2 rounded-[6px] px-4 py-2">
          <i className="pi pi-phone text-white"></i>
          <span className="font-bold text-white">{rowData.phone}</span>
        </div>
      </a>
    );
  };

  const header = renderHeader();

  return (
    <>
      <Breadcrumbs pageTitle="Lista de interés" />
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
              globalFilterFields={['name', 'nacionalidad', 'email', 'phone']}
              header={header}
              emptyMessage="No hay clientes"
            >
              <Column
                field="name"
                header="Nombre"
                filter
                filterPlaceholder="Buscar por nombre"
                showFilterMenu={false}
              />
              <Column
                field="situacion"
                header="Situación legal"
                body={situacionBodyTemplate}
                filter
                filterPlaceholder="Buscar por situación legal"
                showFilterMenu={false}
              />
              <Column
                field="nacionalidad"
                header="Nacionalidad"
                body={nacionalidadBodyTemplate}
                filter
                filterPlaceholder="Buscar por nacionalidad"
                showFilterMenu={false}
              />
              <Column
                field="email"
                header="Email"
                body={emailBodyTemplate}
                filter
                filterPlaceholder="Buscar por email"
                showFilterMenu={false}
              />
              <Column
                field="phone"
                header="Teléfono"
                body={phoneBodyTemplate}
                filter
                filterPlaceholder="Buscar por teléfono"
                showFilterMenu={false}
              />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ListPage);
