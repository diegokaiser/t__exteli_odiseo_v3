import { Skeleton } from 'primereact/skeleton';

const SkeletonTimeline = () => {
  return (
    <div className="flex flex-col gap-y-[20px]">
      <div className="w-full">
        <Skeleton height="4rem" borderRadius="14px" />
      </div>
      <div className="w-full">
        <Skeleton height="4rem" borderRadius="14px" />
      </div>
      <div className="w-full">
        <Skeleton height="4rem" borderRadius="14px" />
      </div>
      <div className="w-full">
        <Skeleton height="4rem" borderRadius="14px" />
      </div>
    </div>
  );
};

export default SkeletonTimeline;
