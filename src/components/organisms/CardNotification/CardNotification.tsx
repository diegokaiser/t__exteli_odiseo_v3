'use client';

import { useEffect, useState } from 'react';

import apis from '@/apis';
import { Notification } from '@/types/notification';
import { formatHour } from '@/utils/formatHour';

const CardNotification = () => {
  const [notifications, setNotifications] = useState<{ id: string; data: Notification }[]>([]);

  useEffect(() => {
    const unsubscribe = apis.notification.GetNotifications(setNotifications);

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col justify-start">
        <div>
          {notifications.length === 0 ? (
            <></>
          ) : (
            notifications.map(({ id, data }, index) => (
              <div
                key={id}
                className={`flex gap-x-3 text-sm ${index === 0 ? '' : 'border-t border-solid border-[#bec8d0]'} py-3`}
              >
                <div className="font-semibold w-3/12">{data.title}:</div>
                <div className="font-light">{formatHour(data.hour)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CardNotification;
