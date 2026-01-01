import { Footer } from '@/components/layout';
import { Nav } from '@/components/organisms';

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <Nav />
      <main className="flex-grow-1 p-2 md:p-6" style={{ width: 'calc(100% - 280px)' }}>
        <div
          className="box-border flex flex-col mx-auto px-4 relative w-full md:px-6"
          style={{ minHeight: 'calc(100vh - 124px)' }}
        >
          {children}
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default DashboardWrapper;
