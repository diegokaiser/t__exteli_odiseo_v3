'use client';

import Image from 'next/image';

const LandingHeader = () => {
  return (
    <header className="bg-white w-full!">
      <div className="py-[14px]">
        <div className="w-full lg:w-[1140px] mx-auto my-auto">
          <div className="flex items-center justify-between">
            <div className="w-[200px]">
              <a href="https://extranjeriagrv.es/" target="_self" rel="noopener noreferrer">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Logo"
                  width={130}
                  height={130}
                  loading="eager"
                />
              </a>
            </div>
            <div style={{ width: 'calc(100% - 200px)' }}>
              <nav className="flex justify-end">
                <ul className="flex">
                  <li>
                    <a
                      className="font-[14px] font-semibold p-[15px] text-[#7A7A7A] hover:text-[#CC3366]"
                      href="https://extranjeriagrv.es/"
                      target="_self"
                      rel="noopener noreferrer"
                    >
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a
                      className="font-[14px] font-semibold p-[15px] text-[#7A7A7A] hover:text-[#CC3366]"
                      href="https://extranjeriagrv.es/servicios/"
                      target="_self"
                      rel="noopener noreferrer"
                    >
                      Servicios
                    </a>
                  </li>
                  <li>
                    <a
                      className="font-[14px] font-semibold p-[15px] text-[#7A7A7A] hover:text-[#CC3366]"
                      href="https://extranjeriagrv.es/contacto/"
                      target="_self"
                      rel="noopener noreferrer"
                    >
                      Contacto
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
