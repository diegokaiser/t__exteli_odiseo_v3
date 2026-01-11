import { Skeleton } from 'primereact/skeleton';

const SkeletonCompanyLogo = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <div className="h-[140px] w-[140px]">
        <Skeleton shape="circle" size="140px" />
      </div>
      <div className="flex mt-5 w-full">
        <Skeleton height="2rem" />
      </div>
    </div>
  );
};

export default SkeletonCompanyLogo;
