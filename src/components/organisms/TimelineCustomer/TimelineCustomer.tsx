'use client';

import { Timeline } from 'primereact/timeline';

import { useCustomer } from '@/hooks/useCustomer';
import { useTimeline } from '@/hooks/useTimeline';
import { LineHook } from '@/types/timelines';
import { dateTimeline } from '@/utils/dateTimeline';

const TimelineCustomer = ({ customerId }: { customerId: string }) => {
  const {
    data: customer,
    isLoading: loadingCustomer,
    isError: errorCustomer,
  } = useCustomer(customerId);

  const timelineId = customer?.timeline;

  const {
    data: timeline,
    isLoading: loadingTimeline,
    isError: errorTimeline,
  } = useTimeline(timelineId ?? '');

  const timelineMarker = () => {
    return (
      <span className="h-[14px] w-[14px] bg-white rounded-full border-[4px] border-solid border-[#2196F3]"></span>
    );
  };

  const timelineContent = (item: LineHook) => {
    return (
      <div className="box-border rounded-[8px] border border-solid border-[#bec8d0] px-[21px] py-[14px]">
        <p className="mb-[4px] text-[12px]">{dateTimeline(item.createdAt)}</p>
        <p className="mb-[6px] text-[14px]">{item.comment}</p>
        <p className="italic text-right text-[12px]">{item.registerdBy}</p>
      </div>
    );
  };

  return (
    <>
      {!loadingTimeline && (
        <Timeline
          value={timeline!}
          align="left"
          marker={timelineMarker}
          content={timelineContent}
        />
      )}
    </>
  );
};

export default TimelineCustomer;
