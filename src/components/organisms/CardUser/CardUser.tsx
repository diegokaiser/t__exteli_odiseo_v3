'use client';

import { useState } from 'react';

import { useUser } from '@/hooks/useUsers';
import { Tag } from 'primereact/tag';

const UserAvatarMale = '/assets/images/users/avatarCustomerMale.png';
const UserAvatarFemale = '/assets/images/users/avatarCustomerFem.png';

const CardUser = ({ userUid }: { userUid: string }) => {
  const { data: user, isLoading: loadingUser, isError: errorUser } = useUser(userUid);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center">
      <div className="h-[140px] w-[140px]">
        <img
          style={{
            borderColor: `${user?.status == 'Activo' ? '#8BC34A' : `${user?.status == 'Incompleto' ? '#263238' : `${user?.status == 'Pendiente' ? '#E0E0E0' : '#FFD54F'}`}`}`,
          }}
          className="border-[4px] h-full rounded-full w-full"
          src={user?.gender == 'Masculino' ? UserAvatarMale : UserAvatarFemale}
          alt={user?.firstName}
        />
      </div>
      <div className="flex flex-col items-center mt-5">
        <h5 className="capitalize font-bold text-sm">{user?.fullName}</h5>
      </div>
      {user?.role && (
        <Tag
          className={`badge ${user?.role == 'Administrador' ? 'bg-[#8BC34A]' : `${user?.role == 'Colaborador' ? 'bg-[#263238]' : `${user?.role == 'Practicante' ? 'bg-[#E0E0E0]' : 'bg-[#FFD54F]'}`}`} mt-2`}
          value={user?.role}
        />
      )}
    </div>
  );
};

export default CardUser;
