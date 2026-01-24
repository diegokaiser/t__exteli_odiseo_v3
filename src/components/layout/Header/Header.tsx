'use client';

const HeaderComponent = () => {
  const openAlerts = () => {
    console.log('openAlerts');
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
            onClick={openAlerts}
          >
            <span className="pi pi-bell"></span>
            <span
              className="absolute bg-[#2ca87f] box-border flex flex-wrap items-center justify-center h-4 leading-1 right-[4px] rounded-full p-1 text-xs text-white top-[2px] w-4 z-10"
              style={{ transform: 'scale(1) translate(50%, -50%)' }}
            >
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
