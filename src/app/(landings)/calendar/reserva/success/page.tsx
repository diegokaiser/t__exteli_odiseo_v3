'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';

import { calendarSuccessDateFormat } from '@/utils/calendarSuccessDateFormat';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const toast = useRef<Toast>(null);
  const [reservation, setReservation] = useState<any>(null);

  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'error'>('pending');

  useEffect(() => {
    if (!sessionId) return;

    let interval: NodeJS.Timeout;

    const verify = async () => {
      try {
        const res = await fetch(`/api/stripe/verify?session_id=${sessionId}`);
        const data = await res.json();

        if (data.status === 'paid') {
          setStatus('paid');
          clearInterval(interval);
        }
      } catch (error) {
        setStatus('error');
        clearInterval(interval);
      }
    };

    verify();

    interval = setInterval(verify, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    const reservation = localStorage.getItem('pendingReservation');
    if (reservation) {
      setReservation(JSON.parse(reservation));
      localStorage.removeItem('pendingReservation');
    }
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <div className="p-8 px-6">
        <div className="flex justify-center">
          <div className="container flex justify-center gap-x-4">
            <div className="w-[410px]">
              <div className="flex flex-col items-center gap-y-4">
                <div
                  className={`${status === 'paid' ? 'bg-green-400' : status === 'error' ? 'bg-[#ef4444]' : 'bg-[#f97316]'} flex h-[120px] items-center justify-center p-4 rounded-full w-[120px] relative`}
                >
                  <span
                    className={`absolute animate-ping ${status === 'paid' ? 'bg-green-100' : status === 'error' ? 'bg-[#ef4444]' : 'bg-[#f97316]'} h-full inline-flex rounded-full opacity-75 w-full`}
                  ></span>
                  <div className="relative z-10">
                    <h1 className="text-6xl">
                      {status === 'paid' ? (
                        <span>🎉</span>
                      ) : status === 'error' ? (
                        <span className="text-white">⚠</span>
                      ) : (
                        <span className="animate-spin">🕑</span>
                      )}
                    </h1>
                  </div>
                </div>
                <h3 className="font-semibold text-2xl">
                  {status === 'paid'
                    ? '¡Reserva exitosa!'
                    : status === 'error'
                      ? '¡Reserva fallida!'
                      : 'Verificando...'}
                </h3>
                <p className="font-light mb-4 text-center text-md">
                  {status === 'paid'
                    ? `Gracias, ${reservation?.name} se ha registrado tu reserva correctamente.`
                    : status === 'error'
                      ? 'Algo salió mal, por favor intenta de nuevo.'
                      : `${reservation?.name}, tu reserva se está verificando, en breve tu cita estará reservada.`}
                </p>
                {status === 'paid' && (
                  <>
                    <div className="box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] bg-white">
                      <div className="w-full p-5">
                        <p className="mb-4 font-semibold text-center text-md">Datos de tu cita</p>
                        <div className="flex flex-col gap-y-2">
                          <div className="flex items-center gap-x-2">
                            <div className="flex items-center gap-x-2 w-3/12">
                              <i className="pi pi-clock"></i>
                              <p className="font-semibold text-sm">Fecha:</p>
                            </div>
                            <div className="w-9/12">
                              <p className="font-light text-sm">
                                {calendarSuccessDateFormat(reservation?.start)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-x-2">
                            <div className="flex items-center gap-x-2 w-3/12">
                              <i className="pi pi-clock"></i>
                              <p className="font-semibold text-sm">Hora:</p>
                            </div>
                            <div className="w-9/12">
                              <p className="font-light text-sm">{reservation?.hour} hrs.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs">
                      <p>
                        Ahora puedes cerrar esta ventana o ir a la{' '}
                        <Link
                          className="font-semibold text-blue-500 underline"
                          href="https://extranjeriagrv.es"
                          target="_blank"
                        >
                          página principal
                        </Link>
                      </p>
                    </div>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <div className="text-xs">
                      <p>
                        Puedes{' '}
                        <Link
                          className="font-semibold text-blue-500 underline"
                          href="https://extranjeriagrv.es/reserva-tu-cita"
                          target="_blank"
                        >
                          intentar de nuevo
                        </Link>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
