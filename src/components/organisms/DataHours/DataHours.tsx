import { useGetHoursByYear } from '@/hooks/useClockify';

const DataHours = () => {
  const { data: hours } = useGetHoursByYear('2026', true);
  console.log(hours);

  return (
    <form className="p-6">
      <div className="basis-[50%] min-w-[50%]">
        <div
          className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
          style={{ width: 'calc(100% + 24px)' }}
        >
          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            {hours && (
              <>
                {hours.id}
                {Object.entries(hours.months).map(([month, totalHours]) => (
                  <div key={month}>
                    {month}: {totalHours?.totalHours} hrs.
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default DataHours;
