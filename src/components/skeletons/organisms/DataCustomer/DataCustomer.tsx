import { Skeleton } from 'primereact/skeleton';

const SkeletonDataCustomer = () => {
  return (
    <div className="p-6">
      <div className="basis-[50%] min-w-[50%]">
        <div
          className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
          style={{ width: 'calc(100% + 24px)' }}
        >
          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <Skeleton height="3rem" />
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <Skeleton height="3rem" />
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <Skeleton height="3rem" />
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <Skeleton height="3rem" />
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <Skeleton height="3rem" />
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <Skeleton height="3rem" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDataCustomer;
