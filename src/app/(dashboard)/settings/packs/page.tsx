'use client';

import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

import { LoadingScreen, Message } from '@/components/atoms';
import { Breadcrumbs } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { usePacks } from '@/hooks/usePack';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const PacksPage = () => {
  const router = useRouter();
  const { data: packs, isLoading: loadingPacks, isError: errorPacks } = usePacks();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    price: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  if (loadingPacks) return <LoadingScreen />;
  if (errorPacks)
    return <Message severity="error" summary="Error" detail="Error al cargar los trámites" />;

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
                value={packs}
                header={header}
                filters={filters}
                globalFilterFields={['name', 'price']}
                emptyMessage="No se encontraron trámites"
              >
                <Column field="name" header="Nombre" />
                <Column field="price" header="Precio" />
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
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(PacksPage);
