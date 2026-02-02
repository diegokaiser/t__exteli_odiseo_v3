import { DashboardWrapper } from '@/components/wrappers';
import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <DashboardWrapper>{children}</DashboardWrapper>;
};

export default DashboardLayout;
