'use client';

import { useEffect, useState } from 'react';

import { useCustomer } from '@/hooks/useCustomer';
import { Tag } from 'primereact/tag';

const UserAvatarMale = '/assets/images/users/avatarCustomerMale.png';
const UserAvatarFemale = '/assets/images/users/avatarCustomerFem.png';

const CardCustomer = ({ customerId }: { customerId: string }) => {
  const {
    data: customer,
    isLoading: loadingCustomer,
    isError: errorCustomer,
  } = useCustomer(customerId);
  /* const { data: customerServicesData, isLoading: loadingServicesData, isError: errorServicesData } = useServicesQty(customerId) */
  /* const { data: customerServices, isLoading: loadingServices, isError: errorServices } = useServicesByCustomer(customerId) */

  const [avatarNumber, setAvatarNumber] = useState<Number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setAvatarNumber(Math.floor(Math.random() * 10) + 1);
  });

  return (
    <div className="flex flex-col items-center">
      <div className="h-[140px] w-[140px]">
        <img
          style={{
            borderColor: `${customer?.status == 'Activo' ? '#8BC34A' : `${customer?.status == 'Incompleto' ? '#263238' : `${customer?.status == 'Pendiente' ? '#E0E0E0' : '#FFD54F'}`}`}`,
          }}
          className="border-[4px] h-full rounded-full w-full"
          src={customer?.gender == 'Masculino' ? UserAvatarMale : UserAvatarFemale}
          alt={customer?.firstName}
        />
      </div>
      <div className="flex flex-col items-center mt-5">
        <h5 className="capitalize font-bold text-sm">{customer?.fullName}</h5>
      </div>
      {customer?.status && (
        <Tag
          className={`badge ${customer?.status == 'Activo' ? 'bg-[#8BC34A]' : `${customer?.status == 'Incompleto' ? 'bg-[#263238]' : `${customer?.status == 'Pendiente' ? 'bg-[#E0E0E0]' : 'bg-[#FFD54F]'}`}`} mt-2`}
          value={customer?.status}
        />
      )}
    </div>
  );
};

export default CardCustomer;
