'use client';

import { useState } from 'react';

const HeaderComponent = () => {
  const [openAlerts, setOpenAlerts] = useState(false);

  const handleOpenAlerts = () => {
    setOpenAlerts(!openAlerts);
  };

  return (
    <header className="backdrop-blur-[8px] box-border fixed flex flex-col left-auto ml-[280] shadow-none right-0 shrink-0 text-white top-0 z-[1000]">
      <div className="flex items-center min-h-[74px] px-4 py-2 relative md:px-6 xl:pl-16 xl:pr-6">
        <div className="ml-0 w-full lg:ml-[16px]">
          <div className="align-top b-0 inline-flex flex-col m-0 min-w-0 p-0 relative w-[100%] lg:w-[224px]"></div>
        </div>
        <div className="ml-1 shrink-0 min-w-[44px]"></div>
        <div className="ml-1 shrink-0 min-w-[44px]"></div>
        <div className="ml-1 shrink-0 min-w-[44px]">
          <button
            className="b-0 bg-[#f3f5f7] box-border cursor-pointer h-11 inline-flex items-center justify-center m-0 outline-0 p-2 relative rounded-[8px] text-[#5b6b79] w-11 hover:bg-[#dbe0e5]"
            style={{
              textDecoration: 'none',
              transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            }}
            onClick={handleOpenAlerts}
          >
            <span className="pi pi-bell"></span>
            <span
              className="absolute bg-[#2ca87f] box-border flex flex-wrap items-center justify-center h-4 leading-1 right-[4px] rounded-full p-1 text-xs text-white top-[2px] w-4 z-10"
              style={{ transform: 'scale(1) translate(50%, -50%)' }}
            >
              2
            </span>
          </button>
          {openAlerts && (
            <div
              className=""
              style={{
                inset: '0px 0px auto auto',
                margin: '0px',
                position: 'absolute',
                transform: 'translate3d(-64px, 68px, 0px)',
              }}
            >
              <div>
                <div
                  className="origin-top-right"
                  style={{
                    opacity: '1',
                    transform: 'none',
                    transition:
                      'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 100ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <div
                    className="bg-white border border-solid border-[#dbe0e5a6] max-w-[450px] min-w-[420px] rounded-[12px] w-[450px] text-[#1d2630]"
                    style={{
                      boxShadow: '0px 8px 24px rgba(19, 25, 32, 0.08)',
                      transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    }}
                  >
                    <div
                      className="bg-white border-0 border-[rgba(219, 224, 229, 0.65)] overflow-hidden relative rounded-[12px] shadow-none text-[#1d2630]"
                      style={{ transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms' }}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-md">Notificaciones</h5>
                          <span className="cursor-pointer text-sm hover:underline">
                            Marcar todos como leídos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
