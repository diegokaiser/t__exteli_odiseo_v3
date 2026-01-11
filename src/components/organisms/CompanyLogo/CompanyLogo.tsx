'use client';

import { useCompanies } from '@/hooks/useCompany';
import { Tag } from 'primereact/tag';

const logo = '/assets/images/logo2.jpeg';

const CompanyLogo = () => {
  const { data: companies, isLoading: loadingCompanies, isError: errorCompanies } = useCompanies();

  return (
    <div className="flex flex-col items-center p-6">
      <div className="h-[140px] w-[140px]">
        <img
          className="border-[4px] border-[#8BC34A] h-full rounded-full w-full"
          src={logo}
          alt={companies?.[0]?.name}
        />
      </div>
      <div className="flex flex-col items-center mt-5">
        <h5 className="capitalize font-bold text-sm">{companies?.[0]?.name}</h5>
      </div>
      <Tag className="badge bg-[#8BC34A] mt-2" value={companies?.[0]?.document} />
    </div>
  );
};

export default CompanyLogo;
