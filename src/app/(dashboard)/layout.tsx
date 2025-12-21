import { DashboardWrapper } from '@/app/components/wrappers';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardWrapper>{children}</DashboardWrapper>;
};

export default DashboardLayout;
