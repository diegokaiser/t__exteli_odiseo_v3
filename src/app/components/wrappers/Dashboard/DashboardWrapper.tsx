import { Nav } from "@/app/components/organisms";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <Nav />
      <main className="flex-grow-1 p-2 md:p-6" style={{ width: 'calc(100% - 280px)' }}>
        <div className="flex items-center min-h-[74px] px-4 py-2 md:px-6"></div>
        <div
          className="box-border flex flex-col mx-auto px-4 relative w-full md:px-6"
          style={{ minHeight: 'calc(100vh - 124px)' }}
        >

          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardWrapper;