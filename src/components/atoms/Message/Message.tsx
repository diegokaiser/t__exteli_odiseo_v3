import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';

type Severity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

const Message = ({
  severity,
  summary,
  detail,
}: {
  severity: Severity;
  summary: string;
  detail: string;
}) => {
  const toast = useRef<Toast>(null);

  const show = () => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  useEffect(() => {
    show();
  }, [severity, summary, detail]);

  return (
    <>
      <Toast ref={toast} />
    </>
  );
};

export default Message;
