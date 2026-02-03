'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';

import { LoadingScreen, Message } from '@/components/atoms';
import { Breadcrumbs } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useBillsByMonth, useCancelBill, usePaidBill } from '@/hooks/useBills';
import { Bill } from '@/types/bills';
import Link from 'next/link';

const BillingPage = () => {
  const router = useRouter();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYearh] = useState(currentYear);

  const { data: bills, isLoading, isError } = useBillsByMonth(month, year);

  const { mutate: paidBill, isPending: isPaidBillLoading } = usePaidBill();
  const { mutate: cancelBill, isPending: isCancelBillLoading } = useCancelBill();

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    number: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    customer: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    createDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
    total: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <Message severity="error" summary="Error" detail="Error al cargar las facturas" />;

  const statusOptions = ['pendiente', 'pagada', 'cancelada'];

  const goToPreviousMonth = () => {
    const newDate = new Date(year, month - 1);
    setMonth(newDate.getMonth());
    setYearh(newDate.getFullYear());
  };

  const goToNextMonth = () => {
    setMonth(month + 1);
    setYearh(year);
  };

  const isCurrentMonth = month === currentMonth && year === currentYear;

  const getSeverity = (statusOptions: string) => {
    switch (statusOptions) {
      case 'pendiente':
        return 'warning';
      case 'pagada':
        return 'success';
      case 'cancelada':
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

  const statusItemTemplate = (option: string) => {
    return <>{option}</>;
  };

  const statusBodyTemplate = (rowData: Bill) => {
    return (
      <>
        {rowData.status && (
          <Tag
            className="uppercase"
            value={rowData.status}
            severity={getSeverity(rowData.status)}
          />
        )}
      </>
    );
  };

  const statusRowFilterTemplate = () => {
    return (
      <Dropdown
        value={filters.status.value}
        options={statusOptions}
        onChange={(e: DropdownChangeEvent) => (filters.status.value = e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Seleccionar estado"
        className="p-column-filter capitalize"
        showClear
      />
    );
  };

  const actionsBodyTemplate = (rowData: Bill) => {
    return (
      <div className="flex gap-3">
        <Tooltip target=".btn-success" />
        <Tooltip target=".btn-danger" />
        <Tooltip target=".btn-primary" />
        <button
          className="bg-[#22c55e] btn-success cursor-pointer flex items-center justify-center p-[6px] rounded-full w-[32px] h-[32px]"
          data-pr-tooltip="Marcar como pagada"
          data-pr-position="top"
          onClick={() => openConfirmDialog({ id: rowData.id, type: 'markAsPaid' })}
        >
          <i className="pi pi-arrow-up" style={{ color: 'white' }}></i>
        </button>
        <button
          className="bg-[#ef4444] btn-danger cursor-pointer flex items-center justify-center p-[6px] rounded-full w-[32px] h-[32px]"
          data-pr-tooltip="Cancelar factura"
          data-pr-position="top"
          onClick={() => openConfirmDialog({ id: rowData.id, type: 'markAsCanceled' })}
        >
          <i className="pi pi-times" style={{ color: 'white' }}></i>
        </button>
        <Link
          className="bg-[#06b6d4] btn-primary cursor-pointer flex items-center justify-center p-[6px] rounded-full w-[32px] h-[32px]"
          data-pr-tooltip="Ver factura"
          data-pr-position="top"
          href={`/dashboard/billing/${rowData.id}`}
        >
          <i className="pi pi-file-pdf" style={{ color: 'white' }}></i>
        </Link>
      </div>
    );
  };

  const openConfirmDialog = ({
    id,
    type,
  }: {
    id: string;
    type: 'markAsPaid' | 'markAsCanceled';
  }) => {
    if (type === 'markAsPaid') {
      confirmMarkAsPaid(id);
    } else {
      confirmMarkAsCanceled(id);
    }
  };

  const confirmMarkAsPaid = (id: string) => {
    confirmDialog({
      group: 'headless',
      message: '¿Estás seguro de marcar la factura como pagada?',
      defaultFocus: 'accept',
      acceptLabel: 'Marcar como pagada',
      rejectLabel: 'Cancelar',
      accept: () => {
        paidBill(id);
      },
    });
  };

  const confirmMarkAsCanceled = (id: string) => {
    confirmDialog({
      group: 'headless',
      message: '¿Estás seguro de marcar la factura como cancelada?',
      defaultFocus: 'accept',
      acceptLabel: 'Marcar como cancelada',
      rejectLabel: 'Cancelar',
      accept: () => {
        cancelBill(id);
      },
    });
  };

  const header = renderHeader();

  return (
    <>
      {isPaidBillLoading || (isCancelBillLoading && <LoadingScreen />)}
      <ConfirmDialog group="headless" />
      <Breadcrumbs labels={{ billing: 'Facturación' }} pageTitle="Facturación" />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="flex justify-between w-full">
          <button
            className="bg-[#06b6d4] border border-[#06b6d4] rounded-[6px] cursor-pointer flex items-center gap-x-3 px-[12px] py-[4px] text-white hover:bg-[white] hover:text-[#06b6d4]"
            type="button"
            onClick={goToPreviousMonth}
          >
            <i className="pi pi-arrow-left"></i>
            <span>Mes Anterior</span>
          </button>
          {!isCurrentMonth && (
            <button
              className="bg-[#06b6d4] border border-[#06b6d4] rounded-[6px] cursor-pointer flex items-center gap-x-3 px-[12px] py-[4px] text-white hover:bg-[white] hover:text-[#06b6d4]"
              type="button"
              onClick={goToNextMonth}
            >
              <span>Mes Siguiente</span>
              <i className="pi pi-arrow-right"></i>
            </button>
          )}
        </div>
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <DataTable
              value={bills}
              paginator
              rows={10}
              dataKey="id"
              filters={filters}
              filterDisplay="row"
              globalFilterFields={['number', 'customer', 'createDate', 'total', 'status']}
              header={header}
              emptyMessage="No hay facturas"
              selectionMode="single"
              onRowClick={(e) => router.push(`/billing/${e.data.id}`)}
            >
              <Column
                field="number"
                header="Número"
                filter
                showFilterMenu={false}
                filterPlaceholder="Filtrar por número de factura"
              />
              <Column
                field="customer"
                header="Cliente"
                showFilterMenu={false}
                filter
                filterPlaceholder="Filtrar por cliente"
              />
              <Column
                field="createDate"
                header="Creado el"
                showFilterMenu={false}
                filter
                filterPlaceholder="Filtrar por fecha de creación"
              />
              <Column
                field="total"
                header="Total"
                showFilterMenu={false}
                filter
                filterPlaceholder="Buscar por total"
              />
              <Column
                field="status"
                header="Estado"
                showFilterMenu={false}
                body={statusBodyTemplate}
                filter
                filterElement={statusRowFilterTemplate}
              />
              <Column header="Acciones" body={actionsBodyTemplate} exportable={false} />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(BillingPage);
