'use client';

import { Breadcrumb } from '@/types/breadcrumbs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const breadcrumbs: React.FC<Breadcrumb> = ({ labels, pageTitle }) => {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      label: labels?.[segment] || decodeURIComponent(segment),
      href: index < pathSegments.length - 1 ? href : undefined,
    };
  });

  const items = [{ label: 'Home', href: '/' }, ...breadcrumbs];

  return (
    <div className="text-[#1d2630] shadow-none overflow-hidden relative border-0 rounded-[12px] border-[#dbe0e5a6] mb-6 bg-transparent">
      <div
        className="box-border flex flex-wrap flex-col justify-start items-start"
        style={{ width: 'calc(100% + 4px)' }}
      >
        <div className="box-border m-0 max-w-none pt-1">
          <nav className="m-0 text-xs font-normal" style={{ lineHeight: '1.27' }}>
            <ol className="flex flex-wrap items-center p-0 m-0" style={{ listStyle: 'none' }}>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  <li>
                    {item.href ? (
                      <Link href={item.href} className="flex items-center capitalize">
                        {item.href == '/' ? <span className="pi pi-home mr-[6px]"></span> : <></>}
                        {item.label}
                      </Link>
                    ) : (
                      <span className="flex items-center capitalize">{item.label}</span>
                    )}
                  </li>
                  {index < items.length - 1 && <li className="flex ml-2 mr-2">/</li>}
                </React.Fragment>
              ))}
            </ol>
          </nav>
        </div>
        {pageTitle && (
          <div className="box-border m-0 mt-0 max-w-none pt-1">
            <h2 className="capitalize m-0 text-3xl font-semibold" style={{ lineHeight: '1.27' }}>
              {pageTitle}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default breadcrumbs;
