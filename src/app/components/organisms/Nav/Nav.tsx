'use client'

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { Loader, LoadingScreen } from "@/app/components/atoms";

const UserAvatar = '/assets/images/users/avatar-6.png'

const Nav = () => {
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
  }

  return (
    <>
      {submitting && <LoadingScreen />}
      <nav className="shrink-0 z-[1000]">
        <div className="box-border border-r border-dashed border-[#bec8d0] shadow-none overflow-x-hidden whitespace-nowrap w-[280px]">
          <div className="bg-[#F8F9FA] bg-none border-r border-dashed border-[#bec8d0] fixed flex flex-col h-full left-0 overflow-x-hidden outline-0 overflow-y-auto shadow-none text-[#1D2630] top-0 w-[280px] z-[1200]">
            {/** logo */}
            <div
              className="flex items-center justify-start min-h-[74px] pb-2 pl-6 pt-2"
              style={{ width: 'initial' }}
            >
            </div>
            {/** menu */}
            <div className="flex-grow-1 h-full overflow-hidden">

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
                        src={UserAvatar}
                        alt={user?.name || ''}
                      />
                    </div>
                  </div>
                  <div className="mb-[6px] mt-[6px] min-w-0" style={{ flex: '1 1 auto' }}>
                    <span className="font-semibold text-sm">{user?.name ?? <Loader />}</span>
                    <p className="font-light text-xs">{user?.email ?? <Loader />}</p>
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
}

export default Nav
