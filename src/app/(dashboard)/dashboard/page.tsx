'use client';

import { useAuth } from '@/auth/hooks/useAuth';
import { CardBill, CardCalendar, DashboardBill, DashboardBillCount } from '@/components/organisms';
import { withAuth } from '@/hocs/withAuth';
import { useGetBillsByStatus } from '@/hooks/useBills';

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    data: approvedBills,
    isLoading: loadingApprovedBills,
    isError: errorApprovedBills,
  } = useGetBillsByStatus('Pagado');

  const {
    data: pendingBills,
    isLoading: loadingPendingbills,
    isError: errorPendingBills,
  } = useGetBillsByStatus('pendiente');

  const {
    data: cancelledBills,
    isLoading: loadingCancelledBills,
    isError: errorCancelledBills,
  } = useGetBillsByStatus('Cancelado');

  return (
    <>
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[50%] md:max-w-[50%] xl:basis-[25%] xl:max-w-[25%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">Citas del día</span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="py-2">
              <CardCalendar />
            </div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[50%] md:max-w-[50%] xl:basis-[25%] xl:max-w-[25%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas pagadas mes actual
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-2">
              {user?.labels[0] == 'Administrador' ? (
                <DashboardBill status="Pagado" />
              ) : (
                <DashboardBillCount status="Pagado" />
              )}
            </div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[50%] md:max-w-[50%] xl:basis-[25%] xl:max-w-[25%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas pendientes mes actual
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-2">
              {user?.labels[0] == 'Administrador' ? (
                <DashboardBill status="pendiente" />
              ) : (
                <DashboardBillCount status="pendiente" />
              )}
            </div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[50%] md:max-w-[50%] xl:basis-[25%] xl:max-w-[25%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas pagadas mes anterior
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-2">
              {user?.labels[0] == 'Administrador' ? (
                <DashboardBill status="Pagado" period="anterior" />
              ) : (
                <DashboardBillCount status="Pagado" period="anterior" />
              )}
            </div>
          </div>
        </div>

        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[33%] md:max-w-[33%] xl:basis-[33%] xl:max-w-[33%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas Pagadas del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="py-2">
              {!loadingPendingbills && <CardBill bills={approvedBills!} type="approved" />}
            </div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[33%] md:max-w-[33%] xl:basis-[33%] xl:max-w-[33%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas Pendientes del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="py-2">
              {!loadingPendingbills && <CardBill bills={pendingBills!} type="pending" />}
            </div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[33%] md:max-w-[33%] xl:basis-[33%] xl:max-w-[33%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Facturas canceladas del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="py-2">
              {!loadingCancelledBills && <CardBill bills={cancelledBills!} type="cancelled" />}
            </div>
          </div>
        </div>

        {/** 
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[66.666667%] md:max-w-[66.666667%] xl:basis-[75%] xl:max-w-[75%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Últimas facturas del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-6"></div>
          </div>
        </div>
        <div className="basis-[100%] flex-grow-0 max-w-[100%] pl-[22px] pt-9 md:basis-[33.333333%] md:max-w-[33.333333%] xl:basis-[25%] xl:max-w-[25%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="p-5">
              <span className="m-0 text-xs font-semibold block uppercase">
                Últimas facturas del mes
              </span>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <div className="p-6"></div>
          </div>
        </div>
        */}
      </div>
    </>
  );
};

export default withAuth(DashboardPage);
