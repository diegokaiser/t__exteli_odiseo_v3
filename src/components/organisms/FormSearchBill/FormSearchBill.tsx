'use client';

import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { useMemo, useRef, useState } from 'react';

import { LoadingScreen } from '@/components/atoms';
import { useFindBills } from '@/hooks/useBills';
import { BillSearchBy } from '@/types/bills';
import Link from 'next/link';

const FormSearchBill = () => {
  const toast = useRef<any>(null);
  const router = useRouter();

  const [by, setBy] = useState<BillSearchBy>('billNumber');
  const [input, setInput] = useState('');

  const [searchParams, setSearchParams] = useState<{ by: BillSearchBy; value: string }>({
    by: 'billNumber',
    value: '',
  });

  const q = useFindBills(searchParams);

  const isBusy = q.isFetching;

  const placeholder = useMemo(() => {
    if (by === 'billNumber') return 'Número de factura';
    if (by === 'customer') return 'Cliente';
    return 'Fecha de creación';
  }, [by]);

  const validate = (by: BillSearchBy, value: string) => {
    const v = value.trim();
    if (!v) return 'Escribe un valor para buscar';

    if (by === 'createDate') {
      const ok = /^\d{4}-\d{2}-\d{2}$/.test(v);
      if (!ok) return 'Fecha inválida';
    }

    return null;
  };

  const onSearch = async () => {
    const error = validate(by, input);
    if (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error,
      });
      return;
    }

    const next = { by, value: input.trim() };
    setSearchParams(next);

    queueMicrotask(async () => {
      const res = await q.refetch();
      if (res.data?.length === 0) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se encontraron resultados',
        });
      }
    });
  };

  return (
    <>
      <Toast ref={toast} />
      {isBusy && <LoadingScreen />}
      <div className="p-6">
        <div className="basis-[50%] min-w-[50%]">
          <div
            className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
            style={{ width: 'calc(100% + 24px)' }}
          >
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6">
              <div className="bg-[#f8f9fa] p-6 rounded-[12px]">
                <form className="flex flex-col" onSubmit={onSearch}>
                  <label className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]">
                    Buscar por Número o código de factura, cliente o fecha de creación
                  </label>
                  <div className="flex p-0 border-0 align-top gap-x-3 w-full mb-2 mt-2">
                    <div className="w-2/12">
                      <div className="bg-white box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <select
                          className="w-full h-full px-3 rounded-[8px] outline-none"
                          value={by}
                          onChange={(e) => setBy(e.target.value as BillSearchBy)}
                        >
                          <option value="billNumber">Número de factura</option>
                          <option value="customer">Cliente (nombre completo)</option>
                          <option value="createDate">Fecha de creación</option>
                        </select>
                      </div>
                    </div>
                    <div className="w-4/12">
                      <div className="bg-white box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                        <input
                          className="w-full h-full px-3 rounded-[8px] outline-none"
                          type="text"
                          value={input}
                          placeholder={placeholder}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') onSearch();
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-4/12">
                      <button
                        type="button"
                        onClick={onSearch}
                        disabled={isBusy}
                        className="bg-[#007bff] box-border flex items-center gap-x-2 h-12 text-white px-4 py-2 rounded-[8px]"
                      >
                        <i className="pi pi-search"></i>
                        Buscar
                      </button>
                    </div>
                    <div className="w-2/12"></div>
                  </div>
                </form>
              </div>
            </div>
            <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6">
              {q.isError && (
                <div className="bg-white border border-red-200 p-4 rounded-[12px] text-red-600">
                  Ocurrió un error al buscar.
                </div>
              )}

              {!q.isFetching && q.data && q.data.length > 0 && (
                <div className="bg-white p-4 rounded-[12px] border border-[#e6eaee]">
                  <div className="text-sm mb-3">
                    Resultados: <b>{q.data.length}</b>
                  </div>

                  <ul className="divide-y">
                    {q.data.map((bill: any) => (
                      <li key={bill.id} className="py-3 flex items-center justify-between">
                        <Link href={`/billing/${bill.id}`} className="w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              #{bill.billNumber} — {bill.customer}
                            </span>
                            <span className="text-xs text-[#5b6b79]">
                              Fecha: {bill.createDate} · Estado: {bill.status} · Total: {bill.total}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!q.isFetching && q.data && q.data.length === 0 && searchParams.value && (
                <div className="bg-white p-4 rounded-[12px] border border-[#e6eaee]">
                  Sin resultados.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormSearchBill;
