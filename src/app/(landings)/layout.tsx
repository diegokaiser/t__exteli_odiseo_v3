import { LandingWrapper } from '@/components/wrappers';
import { ReactNode } from 'react';

const LandingsLayout = ({ children }: { children: ReactNode }) => {
  return <LandingWrapper>{children}</LandingWrapper>;
};

export default LandingsLayout;
