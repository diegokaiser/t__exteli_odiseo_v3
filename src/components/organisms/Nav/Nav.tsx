'use client';

import { useAuth } from '@/auth/hooks/useAuth';
import { Loader, LoadingScreen } from '@/components/atoms';
import { constants } from '@/lib/constants/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const sidebarMenu = constants.sidebarMenu;
const sidebarAdminMenu = constants.sidebarAdminMenu;
const UserAvatarMale = '/assets/images/users/avatarCustomerMale.png';
const UserAvatarFemale = '/assets/images/users/avatarCustomerFem.png';

const Nav = () => {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    setSubmitting(true);
    try {
      await logout();
      router.replace('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {submitting && <LoadingScreen />}
      <nav className="shrink-0 z-[1000]">
        <div className="box-border border-r border-dashed border-[#bec8d0] shadow-none overflow-x-hidden whitespace-nowrap w-[280px]">
          <div className="bg-white bg-none border-r border-dashed border-[#bec8d0] fixed flex flex-col h-full left-0 overflow-x-hidden outline-0 overflow-y-auto shadow-none text-[#1D2630] top-0 w-[280px] z-[1200]">
            {/** logo */}
            <div
              className="flex items-center justify-start min-h-[74px] pb-3 pl-6 pt-3"
              style={{ width: 'initial' }}
            >
              <Image
                src="/assets/images/logo.svg"
                alt="Logo"
                width={74}
                height={74}
                loading="eager"
              />
              <span
                style={{
                  background: 'linear-gradient(206.48deg, #A389D4 11.14%, #899ED4 104.6%)',
                  borderRadius: '50rem',
                  color: '#fff',
                  display: 'inline-block',
                  fontSize: '.75rem',
                  fontWeight: 500,
                  lineHeight: 1,
                  marginLeft: '.5rem',
                  padding: '.45rem .8rem',
                  verticalAlign: 'baseline',
                  whiteSpace: 'nowrap',
                }}
              >
                v2.3.2
              </span>
            </div>
            {/** menu */}
            <div className="flex-grow-1 h-full overflow-hidden">
              <div
                className="relative flex-col flex-wrap justify-start min-h-[100%]"
                style={{ alignContent: 'flex-start', alignItems: 'flex-start' }}
              >
                <div
                  className="m-0 overflow-hidden"
                  style={{
                    width: 'inherit',
                    height: 'inherit',
                    maxWidth: 'inherit',
                    maxHeight: 'inherit',
                  }}
                >
                  <div
                    className="h-full w-full max-w-1 relative float-left max-h-1 overflow-hidden z-[-1] p-0 m-0 pointer-events-none"
                    style={{ boxSizing: 'inherit' }}
                  >
                    <div className="block opacity-0 absolute top-0 left-0 h-[1000%] w-[1000%] min-h-[1px] min-w-[1px] overflow-hidden pointer-events-none z-[-1]"></div>
                  </div>
                  <div
                    className="absolute overflow-hidden p-0 m-0 left-0 top-0 bottom-0 right-0"
                    style={{
                      direction: 'inherit',
                      width: 'auto',
                      height: 'auto',
                      zIndex: 'inherit',
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 p-0 m-0"
                      style={{
                        direction: 'inherit',
                        boxSizing: 'inherit',
                        resize: 'none',
                        right: '0',
                        bottom: '0',
                      }}
                    >
                      <div
                        className="box-border relative block w-auto max-w-full max-h-full"
                        style={{
                          direction: 'inherit',
                          height: 'auto',
                          overflow: 'hidden scroll',
                          scrollbarWidth: 'none',
                        }}
                      >
                        <div className="flex flex-col" style={{ padding: '0' }}>
                          <div className="block items-center pt-4">
                            {sidebarMenu.map((section, sectionIndex) => (
                              <ul
                                key={sectionIndex}
                                className="mt-0 m-0 p-0 relative pt-3 pb-0 z-0"
                                style={{ listStyle: 'none' }}
                              >
                                <div className="pl-6 mb-3 ">
                                  <h5
                                    className="m-0 font-semibold text-[#3e4853] uppercase text-xs"
                                    style={{ lineHeight: '1.5' }}
                                  >
                                    {section.title}
                                  </h5>
                                </div>
                                <div className="mb-3">
                                  {section.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="relative">
                                      <Link
                                        href={item.href}
                                        className={`outline-0 m-0 p-0 cursor-pointer align-middle flex justify-start items-center relative min-w-0 text-left pr-4 z-[1201] pl-5 py-2 mx-[10px] my-1 rounded-[8px] text-sm hover:bg-[#e5e7eb] ${
                                          pathname === item.href
                                            ? 'bg-[#e5e7eb] border border-solid border-[#e5e7eb] text-[#4680FF]'
                                            : 'bg-transparent text-[#5b6b79]'
                                        }`}
                                        style={{
                                          transition:
                                            'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                        }}
                                      >
                                        <div className="inline-flex shrink-0 min-w-[30px]">
                                          {item.icon && (
                                            <span className={`text-sm ${item.icon}`}></span>
                                          )}
                                        </div>
                                        <div className="min-w-0 my-1" style={{ flex: '1 1 auto' }}>
                                          {item.title}
                                        </div>
                                        <span
                                          className="overflow-hidden pointer-events-none absolute z-0 top-0 right-0 bottom-0 left-0"
                                          style={{ borderRadius: 'inherit' }}
                                        ></span>
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </ul>
                            ))}
                            {user?.labels[0] === 'Administrador' && (
                              <>
                                {sidebarAdminMenu.map((section, sectionIndex) => (
                                  <ul
                                    key={sectionIndex}
                                    className="mt-0 m-0 p-0 relative pt-3 pb-0 z-0"
                                    style={{ listStyle: 'none' }}
                                  >
                                    <div className="pl-6 mb-3 ">
                                      <h5
                                        className="m-0 font-semibold text-[#3e4853] uppercase text-xs"
                                        style={{ lineHeight: '1.5' }}
                                      >
                                        {section.title}
                                      </h5>
                                    </div>
                                    <div className="mb-3">
                                      {section.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="relative">
                                          <Link
                                            href={item.href}
                                            className={`outline-0 m-0 p-0 cursor-pointer align-middle flex justify-start items-center relative min-w-0 text-left pr-4 z-[1201] pl-5 py-2 mx-[10px] my-1 rounded-[8px] text-sm hover:bg-[#e5e7eb] ${
                                              pathname === item.href
                                                ? 'bg-[#e5e7eb] border border-solid border-[#e5e7eb] text-[#4680FF]'
                                                : 'bg-transparent text-[#5b6b79]'
                                            }`}
                                            style={{
                                              transition:
                                                'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                                            }}
                                          >
                                            <div className="inline-flex shrink-0 min-w-[30px]">
                                              {item.icon && (
                                                <span className={`text-sm ${item.icon}`}></span>
                                              )}
                                            </div>
                                            <div
                                              className="min-w-0 my-1"
                                              style={{ flex: '1 1 auto' }}
                                            >
                                              {item.title}
                                            </div>
                                            <span
                                              className="overflow-hidden pointer-events-none absolute z-0 top-0 right-0 bottom-0 left-0"
                                              style={{ borderRadius: 'inherit' }}
                                            ></span>
                                          </Link>
                                        </div>
                                      ))}
                                    </div>
                                  </ul>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="h-20"></div>
                      </div>
                    </div>
                  </div>
                  <div className="min-h-full min-w-full pointer-events-none"></div>
                </div>
                <div
                  className="left-0 h-[11px] z-[1] absolute right-0 bottom-0 pointer-events-none overflow-hidden"
                  style={{ visibility: 'hidden' }}
                ></div>
                <div className="w-[10px] top-0 z-[1] absolute right-0 bottom-0 pointer-events-none overflow-hidden"></div>
              </div>
            </div>
            {/** user */}
            <div
              className="border-t-[2px] border-solid border-[#dbe0e5a6] px-6"
              style={{ padding: '10px' }}
            >
              <ul className="m-0 p-0 relative" style={{ listStyle: 'none' }}>
                <li
                  className="text-left box-border flex items-center justify-start relative w-full"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="min-w-[56px] shrink-0">
                    <div className="relative flex items-center justify-center shrink-0 leading-1 rounded-[50%] overflow-hidden bg-[#e9f0ff80] w-[46px] h-[46px]">
                      <img
                        className="w-full h-full text-center object-cover text-transparent indent-[10000px]"
                        src={user?.labels[1] == 'Masculino' ? UserAvatarMale : UserAvatarFemale}
                        alt={user?.name || ''}
                      />
                    </div>
                  </div>
                  <div className="mb-[6px] mt-[6px] min-w-0" style={{ flex: '1 1 auto' }}>
                    <span className="font-semibold text-sm">{user?.name ?? <Loader />}</span>
                    <p className="font-light text-xs">{user?.labels[0] ?? <Loader />}</p>
                  </div>
                  <div
                    className="absolute right-0 top-[50%]"
                    style={{ transform: 'translateY(-50%)' }}
                  >
                    <button
                      className="
                        inline-flex 
                        items-center
                        justify-center
                        relative
                        box-border
                        bg-transparent
                        outline-0
                        border-0
                        m-0
                        cursor-pointer
                        align-middle
                        text-center
                        overflow-visible
                        p-[5px]
                        rounded-[8px]
                        w-[30px]
                        h-[30px]
                        text-xs
                        ml-auto
                        text-red-500
                      "
                      style={{
                        textDecoration: 'none',
                        transform: 'rotate(0deg)',
                        transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                      }}
                      onClick={handleLogout}
                    >
                      <span className="pi pi-sign-out"></span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
