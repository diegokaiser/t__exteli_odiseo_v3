import { Skeleton } from 'primereact/skeleton';

const SkeletonDocument = () => {
  return (
    <div className="p-6">
      <Skeleton shape="rectangle" height="500px" className="w-full" />
    </div>
  );
};

export default SkeletonDocument;
