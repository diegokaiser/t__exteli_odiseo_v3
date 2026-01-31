'use client';

import Link from 'next/link';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const CancelPage = () => {
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
      <div className="p-8 px-6">
        <div className="flex justify-center">
          <div className="container flex justify-center gap-x-4">
            <div className="w-[410px]">
              <div className="flex flex-col items-center gap-y-4">
                <div
                  className={`bg-[#ef4444] flex h-[120px] items-center justify-center p-4 rounded-full w-[120px] relative`}
                >
                  <span className="absolute animate-ping bg-[#ef4444] h-full inline-flex rounded-full opacity-75 w-full"></span>
                  <div className="relative z-10">
                    <h1 className="text-6xl">
                      <span className="text-white">⚠</span>
                    </h1>
                  </div>
                </div>
                <h3 className="font-semibold text-2xl">No se ha procesado el pago</h3>
                <p className="font-light mb-4 text-center text-md">
                  Tu cita no se ha confirmado, por favor intenta de nuevo.
                </p>
                <div className="text-xs">
                  <p>
                    Puedes 👉{' '}
                    <Link
                      className="font-semibold text-blue-500 underline"
                      href="/calendar/reserva"
                      target="_blank"
                    >
                      intentar de nuevo
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelPage;
