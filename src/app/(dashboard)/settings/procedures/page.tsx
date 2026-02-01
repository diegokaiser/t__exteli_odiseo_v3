'use client';

import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useState } from 'react';

import { LoadingScreen, Message } from '@/components/atoms';
import { Breadcrumbs, FormProcedure } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useProcedures } from '@/hooks/useProcedure';
import { Procedure } from '@/types/procedures';

const ProceduresPage = () => {
  const router = useRouter();
  const {
    data: procedures,
    isLoading: loadingProcedures,
    isError: errorProcedures,
  } = useProcedures();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  if (loadingProcedures) return <LoadingScreen />;
  if (errorProcedures)
    return <Message severity="error" summary="Error" detail="Error al cargar los trámites" />;

  const statusProcedure = ['Activo', 'Inactivo'];

  const getSeverity = (statusProcedure: string) => {
    switch (statusProcedure) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
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
      <div className="flex justify-content-between">
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

  const statusItemTemplate = (option: string) => {
    return <>{option}</>;
  };

  const statusBodyTemplate = (rowData: Procedure) => {
    return (
      <>{rowData.status && <Tag value={rowData.status} severity={getSeverity(rowData.status)} />}</>
    );
  };

  const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={statusProcedure}
        onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Seleccionar"
        className="p-column-filter capitalize"
        showClear
      />
    );
  };

  const header = renderHeader();

  return (
    <>
      <Breadcrumbs pageTitle="Trámites" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%] lg:basis-[50%] lg:min-w-[50%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-start justify-center p-6">
              <DataTable
                value={procedures}
                paginator
                rows={15}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                globalFilterFields={['name', 'price', 'status']}
                header={header}
                emptyMessage="No hay trámites"
              >
                <Column
                  field="name"
                  header="Nombre"
                  filter
                  showFilterMenu={false}
                  filterPlaceholder="Buscar"
                />
                <Column
                  field="price"
                  header="Precio"
                  filter
                  showFilterMenu={false}
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
        <div className="box-border m-0 pl-5 pt-5 basis-[100%] grow-0 max-w-[100%] lg:basis-[50%] lg:min-w-[50%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px] mb-5">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">Agregar trámite</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <FormProcedure />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(ProceduresPage);
