import { Customer } from '@/types/customers';
import { Button } from 'primereact/button';

type BillActionsSectionProps = {
  isValid: boolean;
  isRegisteredCustomer: boolean;
  selectedCustomer: Customer | null;
  loading: boolean;
  onPreview: () => void;
  onCancel?: () => void;
};

const BillActionsSection = ({
  isValid,
  isRegisteredCustomer,
  selectedCustomer,
  loading,
  onPreview,
  onCancel,
}: BillActionsSectionProps) => {
  const isPreviewDisabled = !isValid || (isRegisteredCustomer && !selectedCustomer) || loading;

  return (
    <>
      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
        <div className="flex flex-col">
          <Button
            type="button"
            label="Previsualizar"
            disabled={isPreviewDisabled}
            className="disabled:bg-transparent! disabled:cursor-not-allowed! disabled:text-[#dbe0e5]! disabled:border-[#dbe0e5]! disabled:border-[2px]!"
            onClick={onPreview}
          />
        </div>
      </div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
        <div className="flex flex-col">
          <Button
            type="button"
            label="Cancelar"
            severity="danger"
            disabled={loading}
            onClick={onCancel}
          />
        </div>
      </div>

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] mt-4 pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>
    </>
  );
};

export default BillActionsSection;
