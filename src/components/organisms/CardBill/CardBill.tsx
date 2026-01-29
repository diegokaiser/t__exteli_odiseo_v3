'use client';

import Link from 'next/link';

const CardBill = ({ bills, type }: { bills: any; type: string }) => {
  return (
    <>
      {bills.map((bill: any) => (
        <div key={bill.id}>
          <Link
            href={`/billing/${bill.id}`}
            className={`bg-white flex hover:bg-[#ECEFF1] px-4 py-3`}
          >
            <div className="w-1/12">
              <div
                className={`flex justify-center items-center h-[34px] w-[34px] rounded-[12px] border border-solid ${type === 'cancelled' ? 'border-[#ef444480] bg-[#f5bebe80] text-[#ef4444]' : type === 'pending' ? 'border-[#f9731680] bg-[#f7dcb380] text-[#f97316]' : 'border-[#22c55e80] bg-[#22c55e80] text-[#1d2630]'}`}
              >
                <i
                  className={
                    type === 'cancelled'
                      ? 'pi pi-exclamation-circle'
                      : type === 'pending'
                        ? 'pi pi-question-circle'
                        : 'pi pi-check-circle'
                  }
                ></i>
              </div>
            </div>
            <div className="flex ml-3 w-11/12">
              <div className="w-6/12">
                <span className="block text-xs font-semibold capitalize">{bill.customer}</span>
                <span className="block text-xs font-light uppercase">
                  {bill.billSerial}-{bill.billNumber}
                </span>
              </div>
              <div className="flex justify-end w-6/12">
                <span
                  className={`rounded-[4px] flex items-center justify-center text-xs min-w-[50px] font-semibold px-[8px] border border-solid ${type === 'cancelled' ? 'border-[#ef444480] bg-[#f5bebe80] text-[#ef4444]' : type === 'pending' ? 'border-[#f9731680] bg-[#f7dcb380] text-[#f97316]' : 'border-[#22c55e80] bg-[#22c55e80] text-[#1d2630]'}`}
                >
                  €{bill.total}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CardBill;
