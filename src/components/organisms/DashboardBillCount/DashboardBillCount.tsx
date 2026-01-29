'use client';

import { useMonthlyBillCount } from '@/hooks/useBills';

type Props = {
  status: 'Pagado' | 'pendiente' | 'Cancelado';
  period?: 'actual' | 'anterior';
};

const DashboardBillCount = ({ status, period = 'actual' }: Props) => {
  const {
    count: bills,
    isLoading: loadingBills,
    isError: errorBills,
  } = useMonthlyBillCount(status, period);

  return (
    <div className="flex px-4 py-3">
      <div className="min-w-[34px] w-1/12">
        <div
          className={`flex justify-center items-center h-[34px] w-[34px] rounded-[12px] border border-solid ${status === 'Pagado' ? 'border-[#22c55e80] bg-[#22c55e80] text-[#1d2630]' : status === 'pendiente' ? 'border-[#f9731680] bg-[#f7dcb380] text-[#f97316]' : 'border-[#ef444480] bg-[#f5bebe80] text-[#ef4444]'}`}
        >
          <i className="pi pi-euro"></i>
        </div>
      </div>
      <div className="flex items-center ml-3 w-11/12">
        <span className="block text-xs font-semibold">
          Total: {bills} {bills == 1 ? 'factura' : 'facturas'}
        </span>
      </div>
    </div>
  );
};

export default DashboardBillCount;
