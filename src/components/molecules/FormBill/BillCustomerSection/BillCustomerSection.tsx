import { BillForm } from '@/types/bills';
import { Customer } from '@/types/customers';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

type BillCustomerSectionProps = {
  isRegisteredCustomer: boolean;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  customers: Customer[] | undefined;
  loadingCustomers: boolean;
  toggleCustomerType: () => void;
  register: UseFormRegister<BillForm>;
  errors: FieldErrors<BillForm>;
  touchedFields: any;
  selectedCustomerTemplate: (option: Customer, props: any) => React.ReactNode;
  customerOptionTemplate: (option: Customer) => React.ReactNode;
};

const BillCustomerSection = ({
  isRegisteredCustomer,
  selectedCustomer,
  setSelectedCustomer,
  customers,
  loadingCustomers,
  toggleCustomerType,
  register,
  errors,
  touchedFields,
  selectedCustomerTemplate,
  customerOptionTemplate,
}: BillCustomerSectionProps) => {
  return (
    <>
      <h3 className="font-bold min-w-[100%] pl-6 pt-6 text-[14px]">Datos de creación</h3>

      {isRegisteredCustomer ? (
        <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
          <div className="flex flex-col">
            <label
              htmlFor="customer"
              className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
            >
              Cliente
            </label>
            <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
              <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                <Dropdown
                  loading={loadingCustomers}
                  value={selectedCustomer}
                  onChange={(e: DropdownChangeEvent) => setSelectedCustomer(e.value)}
                  options={customers}
                  optionLabel="name"
                  placeholder="Seleccionar cliente"
                  filter
                  filterDelay={400}
                  valueTemplate={selectedCustomerTemplate}
                  itemTemplate={customerOptionTemplate}
                  className="border-0! w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
            <div className="flex flex-col">
              <label
                htmlFor="nonRegisteredCustomerName"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Nombre
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="nonRegisteredCustomerName"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register('nonRegisteredCustomerName', {
                      validate: (value) =>
                        isRegisteredCustomer || value?.trim() ? true : 'El nombre es obligatorio',
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
            <div className="flex flex-col">
              <label
                htmlFor="nonRegisteredCustomerPhone"
                className={`text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%] ${
                  errors.nonRegisteredCustomerPhone && touchedFields.nonRegisteredCustomerPhone
                    ? 'text-red-500'
                    : 'text-[#5b6b79]'
                }`}
              >
                Número de móvil
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div
                  className={`box-border inline-flex w-full relative rounded-[8px] border border-solid h-12 ${
                    errors.nonRegisteredCustomerPhone && touchedFields.nonRegisteredCustomerPhone
                      ? 'border-red-500'
                      : 'border-[#bec8d0]'
                  }`}
                >
                  <InputText
                    id="nonRegisteredCustomerPhone"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register('nonRegisteredCustomerPhone', {
                      validate: (value) =>
                        isRegisteredCustomer || value?.trim()
                          ? true
                          : 'El número de móvil es obligatorio',
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
            <div className="flex flex-col">
              <label
                htmlFor="nonRegisteredCustomerEmail"
                className={`text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%] ${
                  errors.nonRegisteredCustomerEmail && touchedFields.nonRegisteredCustomerEmail
                    ? 'text-red-500'
                    : 'text-[#5b6b79]'
                }`}
              >
                Correo electrónico
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div
                  className={`box-border inline-flex w-full relative rounded-[8px] border border-solid h-12 ${
                    errors.nonRegisteredCustomerEmail && touchedFields.nonRegisteredCustomerEmail
                      ? 'border-red-500'
                      : 'border-[#bec8d0]'
                  }`}
                >
                  <InputText
                    id="nonRegisteredCustomerEmail"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent"
                    {...register('nonRegisteredCustomerEmail', {
                      validate: (value) => {
                        if (isRegisteredCustomer) return true;
                        if (!value?.trim()) return true;

                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailRegex.test(value) ? true : 'El correo electrónico no es válido';
                      },
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[25%] lg:min-w-[25%]">
        <div className="flex flex-col mt-[23px]">
          <Button
            className="px-[6px]! py-[11px]!"
            type="button"
            label={
              isRegisteredCustomer
                ? 'Cambiar a cliente no registrado'
                : 'Cambiar a cliente registrado'
            }
            severity={isRegisteredCustomer ? 'info' : 'secondary'}
            onClick={toggleCustomerType}
          />
        </div>
      </div>

      {isRegisteredCustomer && (
        <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]"></div>
      )}
    </>
  );
};

export default BillCustomerSection;
