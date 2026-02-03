import { LandingFooter, LandingHeader } from '@/components/layout';

const LandingWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <LandingHeader />
      {children}
      <LandingFooter />
    </div>
  );
};

export default LandingWrapper;
