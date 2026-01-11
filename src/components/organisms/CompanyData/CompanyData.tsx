'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';
import { useCompanies, usePatchCompany } from '@/hooks/useCompany';
import { constants } from '@/lib/constants/constants';
import { Company } from '@/types/company';

const { companyDocumentType } = constants;

const CompanyData = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useRef<any>(null);
  const { data: companies, isLoading: loadingCompanies, isError: errorCompanies } = useCompanies();
  const { mutate: patchCompany, isPending: loadingPatchCompany } = usePatchCompany();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<Company>({
    defaultValues: {},
  });

  const onSubmit = (data: Company) => {
    setLoading(true);
    const id = companies?.[0].id;
    if (!id) return;
    const payload: Omit<Company, 'id' | 'createdAt' | 'logo'> = {
      address: data.address,
      agentUid: user?.$id,
      city: data.city,
      country: data.country,
      document: data.document,
      documentType: data.documentType,
      email: data.email,
      name: data.name,
      zipcode: data.zipcode,
    };
    try {
      patchCompany({ id, company: payload });
      toast.current?.show({
        severity: 'success',
        summary: 'Exito',
        detail: 'Datos actualizados correctamente',
        life: 4000,
      });
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    const company = companies?.[0];
    if (company) {
      setValue('name', company.name);
      setValue('email', company.email);
      setValue('document', company.document);
      setValue('documentType', company.documentType);
      setValue('address', company.address);
      setValue('city', company.city);
      setValue('country', company.country);
      setValue('zipcode', company.zipcode);
    }
  }, [companies, setValue]);

  return (
    <>
      <Toast ref={toast} />
      {loadingPatchCompany || (loading && <LoadingScreen />)}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div
          className="box-border flex flex-wrap mt-[-24px] mb-[24px] ml-[-24px] text-[#5b6b79]"
          style={{ width: 'calc(100% + 24px)' }}
        >
          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Nombre
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="name"
                    type="text"
                    className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px] bg-transparent!"
                    {...register('name', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="documentType"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Tipo de documento
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <select
                    id="documentType"
                    className="border-0 box-border bg-none m-0 block min-w-0 w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent!"
                    {...register('documentType', { required: true })}
                  >
                    {companyDocumentType.map((docType) => (
                      <option key={docType} value={docType}>
                        {docType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="document"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Numero de Documento
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="document"
                    type="text"
                    className="border-0! box-border bg-none m-0 block capitalize min-w-0 w-full p-[14px] bg-transparent!"
                    {...register('document', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Correo electrónico
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="email"
                    type="email"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent!"
                    {...register('email', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="address"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Direccion
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="address"
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent!"
                    {...register('address', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="zipcode"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Codigo postal
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="zipcode"
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent!"
                    {...register('zipcode', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="city"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Ciudad
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="city"
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent!"
                    {...register('city', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <label
                htmlFor="country"
                className="text-xs font-light p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
              >
                Pais
              </label>
              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                  <InputText
                    id="country"
                    type="text"
                    className="border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px] bg-transparent!"
                    {...register('country', { required: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-6 lg:basis-[50%] lg:min-w-[50%]">
            <div className="flex flex-col">
              <Button
                label="Actualizar"
                disabled={loadingPatchCompany || loading}
                type="submit"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CompanyData;
