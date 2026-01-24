'use client';

import { useClockifyAlerts } from '@/hooks/useClockifyAlerts';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const Notification = () => {
  const toast = useRef<Toast>(null);

  useClockifyAlerts(toast);

  return <Toast ref={toast} />;
};

export default Notification;
