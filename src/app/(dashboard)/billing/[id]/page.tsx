'use client';

import { withAuth } from '@/hocs/withAuth';
import { useParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

import { LoadingScreen } from '@/components/atoms';
import { Breadcrumbs } from '@/components/organisms';
import { SkeletonDocument } from '@/components/skeletons';
import { Document } from '@/components/wrappers';
import { useBill } from '@/hooks/useBills';
import { PDFViewer } from '@react-pdf/renderer';

const BillPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const billId = typeof id === 'string' ? id : '';

  const { data: bill, isLoading: loadingBill, isError: errorBill } = useBill(billId);

  console.log(bill);

  return (
    <>
      {loadingBill && <LoadingScreen />}
      <Breadcrumbs pageTitle={`Factura N° ${bill?.number}`} />
      <div
        className="box-border flex flex-wrap justify-center"
        style={{ width: 'calc(100% + 28px)' }}
      >
        <div className="box-border m-0 pt-5 basis-[100%] grow-0 max-w-[100%]">
          <div className="bg-white text-[#1d2630] shadow-none overflow-hidden relative border-1 border-solid border-[#dbe0e5a6] rounded-[12px]">
            <div className="flex items-center p-5">
              <div className="" style={{ flex: '1 1 auto' }}>
                <span className="m-0 text-xs font-semibold block uppercase">{bill?.number}</span>
              </div>
            </div>
            <hr className="border-[#dbe0e5a6]" />
            <Suspense fallback={<SkeletonDocument />}>
              {bill && (
                <PDFViewer style={{ width: '100%', height: '800px' }}>
                  <Document
                    billSerial={bill?.billSerial}
                    billNumber={bill?.billNumber}
                    provider={bill?.provider}
                    customerData={bill?.customer}
                    customerPhone={bill?.phone}
                    createDate={bill?.createDate}
                    rowsData={bill?.description}
                    subtotal={bill?.subtotal}
                    descuentos={bill?.descuentos}
                    ivas={bill?.ivas}
                    irpfs={bill?.irpfs}
                    total={bill?.total}
                    notes={bill?.notes}
                    paymentMethod={bill?.paymentMethod}
                    status={bill?.status}
                  />
                </PDFViewer>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(BillPage);
