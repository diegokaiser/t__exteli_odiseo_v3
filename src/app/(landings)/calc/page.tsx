'use client';

import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { usePostCustomer } from '@/hooks/useRegMasCalc';
import { useI18n } from '@/i18n/i18n';
import { getUserData } from '@/utils/getUserData';

type RegMasCalcFormValues = {
  name: string;
  email: string;
  phone: string;

  fechaIngreso: boolean | null;
  fechaIngresoExacta?: string;
  cincoMeses: boolean | null;
  situacion: string;
  familia: boolean | null;
  nacionalidad: string;
  provincia: string;
  comentarios?: string;
};

const RegMasCalc = () => {
  const toast = useRef<any>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useI18n();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    trigger,
    formState: { isValid, errors },
  } = useForm<RegMasCalcFormValues>({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      fechaIngreso: null,
      cincoMeses: null,
      familia: null,
      situacion: '',
      nacionalidad: '',
      provincia: '',
    },
  });

  const postCustomer = usePostCustomer();

  const [sendIt, setSendIt] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const ACTUALIZADO_EL = '20/02/2026';

  const fechaIngreso = watch('fechaIngreso');
  const fechaIngresoExacta = watch('fechaIngresoExacta');
  const cincoMeses = watch('cincoMeses');
  const situacion = watch('situacion');
  const familia = watch('familia');
  const nacionalidad = watch('nacionalidad');
  const provincia = watch('provincia');
  const comentarios = watch('comentarios');

  const isEvaluateReady =
    fechaIngreso !== null &&
    cincoMeses !== null &&
    situacion.trim() !== '' &&
    familia !== null &&
    nacionalidad.trim() !== '' &&
    provincia.trim() !== '';

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const evaluate = async () => {
    if (hasEvaluated) return;
    if (!isEvaluateReady) return;

    requestAnimationFrame(() => {
      scrollToTop();
    });

    const ok = await trigger([
      'fechaIngreso',
      'cincoMeses',
      'situacion',
      'familia',
      'nacionalidad',
      'provincia',
    ]);
    if (!ok) return;

    setIsCalculating(true);

    const values = getValues(['fechaIngreso', 'cincoMeses', 'situacion', 'familia']);
    const [vFechaIngreso, vCincoMeses, vSituacion, vFamilia] = values;

    let s = 0;
    if (vFechaIngreso === true) s += 1;
    if (vCincoMeses === true) s += 1;
    if (vSituacion) s += 1;
    if (vFamilia === true) s += 1;

    setScore(s);
    setHasEvaluated(true);
    setIsCalculating(false);
  };

  const onReset = () => {
    reset();
    setHasEvaluated(false);
    setScore(0);
    setIsCalculating(false);
    setSendIt(false);
  };

  const onSubmit = async (data: any) => {
    const userData = getUserData();

    const payload = {
      ...data,
      ua: {
        locale: userData?.locale,
        timeZone: userData?.timeZone,
      },
    };
    console.log(payload);
    setSendIt(true);
    try {
      await postCustomer.mutateAsync(payload);

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cliente creado correctamente',
        life: 4000,
      });
    } catch (err: any) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Ocurrió un error al crear el cliente',
        life: 4000,
      });
    } finally {
      setTimeout(() => {
        setSendIt(false);
        window.location.reload();
      }, 10000);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6" autoComplete="off">
        <div ref={topRef} id="calc-top">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full lg:w-[900px]">
              <h1 className="leading-[32px] text-center text-[24px] font-bold">
                {t('regMasCalc.title')}
              </h1>
              <p className="text-center text-[24px]">🇦🇷 🇨🇴 🇪🇨 🇬🇹 🇭🇳 🇵🇪 🇷🇴 🇻🇪</p>
              <p className="italic mt-[14px] text-center text-[12px]">
                ({t('regMasCalc.update')} {ACTUALIZADO_EL})
              </p>
              <div className="flex justify-center gap-x-4 mt-[14px]">
                <button
                  type="button"
                  className={`border border-solid cursor-pointer flex font-semibold items-center justify-center px-[10px] py-[6px] rounded-[4px]
                    ${locale === 'es' ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white' : 'bg-white border-[#bec8d0] text-[#333]'}
                  `}
                  aria-pressed={locale === 'es'}
                  onClick={() => setLocale('es')}
                >
                  🇪🇸 Español 🇪🇸
                </button>
                <button
                  type="button"
                  className={`border border-solid cursor-pointer flex font-semibold items-center justify-center px-[10px] py-[6px] rounded-[4px]
                    ${locale === 'en' ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white' : 'bg-white border-[#bec8d0] text-[#333]'}
                  `}
                  aria-pressed={locale === 'en'}
                  onClick={() => setLocale('en')}
                >
                  🇬🇧 English 🇬🇧
                </button>
              </div>
            </div>
            <div className="container flex flex-col-reverse lg:flex-row justify-center gap-x-4 mt-4">
              <div className="w-full lg:w-[490px]">
                <div
                  className="box-border flex flex-wrap ml-[-24px] text-[#5b6b79]"
                  style={{ width: 'calc(100% + 24px)' }}
                >
                  <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3">
                    <div className="flex flex-col gap-y-4">
                      {/** q1 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q1.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q1.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q1.help')}</p>
                        <div className="flex align-center justify-start gap-x-4 mt-[14px]">
                          <button
                            type="button"
                            className={[
                              'btn-success cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white',
                              fechaIngreso === true ? 'bg-[#22c55e]' : 'bg-[#22c55e]/50',
                            ].join(' ')}
                            aria-pressed={fechaIngreso === true}
                            onClick={() =>
                              setValue('fechaIngreso', true, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          >
                            {t('regMasCalc.questions.q1.options.yes')}
                          </button>
                          <button
                            type="button"
                            className={[
                              'btn-danger cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white',
                              fechaIngreso === false ? 'bg-[#ef4444]' : 'bg-[#ef4444]/50',
                            ].join(' ')}
                            aria-pressed={fechaIngreso === false}
                            onClick={() =>
                              setValue('fechaIngreso', false, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          >
                            {t('regMasCalc.questions.q1.options.no')}
                          </button>
                        </div>
                        {fechaIngreso && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q1.success')}
                          </div>
                        )}
                      </div>
                      {/** q2 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q2.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q2.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q2.help')}</p>
                        <div className="flex align-center justify-left gap-x-4 mt-[14px]">
                          <input
                            className="border border-solid border-[#bec8d0] box-border bg-none m-0 block min-w-0 rounded-[8px] w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                            type="date"
                            placeholder={`${t('regMasCalc.questions.q2.placeholder')}`}
                            {...register('fechaIngresoExacta')}
                          />
                        </div>
                        {fechaIngresoExacta && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q2.success')}
                          </div>
                        )}
                      </div>
                      {/** q3 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q3.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q3.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q3.help')}</p>
                        <div className="flex align-center justify-start gap-x-4 mt-[14px]">
                          <button
                            type="button"
                            className={[
                              'btn-success cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white',
                              cincoMeses === true ? 'bg-[#22c55e]' : 'bg-[#22c55e]/50',
                            ].join(' ')}
                            aria-pressed={cincoMeses === true}
                            onClick={() =>
                              setValue('cincoMeses', true, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          >
                            {t('regMasCalc.questions.q3.options.yes')}
                          </button>
                          <button
                            type="button"
                            className={[
                              'btn-danger cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white',
                              cincoMeses === false ? 'bg-[#ef4444]' : 'bg-[#ef4444]/50',
                            ].join(' ')}
                            aria-pressed={cincoMeses === false}
                            onClick={() =>
                              setValue('cincoMeses', false, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          >
                            {t('regMasCalc.questions.q3.options.no')}
                          </button>
                        </div>
                        {cincoMeses && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q3.success')}
                          </div>
                        )}
                      </div>
                      {/** q4 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q4.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q4.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q4.help')}</p>
                        <div className="flex align-center justify-center gap-x-4 mt-[14px]">
                          <select
                            id="situacion"
                            className="border border-solid border-[#bec8d0] box-border bg-none m-0 block min-w-0 rounded-[8px] w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                            {...register('situacion', { required: true })}
                          >
                            <option value="">
                              {t('regMasCalc.questions.q4.select.placeholder')}
                            </option>
                            <option value="asilo">
                              {t('regMasCalc.questions.q4.select.options.asilo')}
                            </option>
                            <option value="irregular">
                              {t('regMasCalc.questions.q4.select.options.irregular')}
                            </option>
                            <option value="visado">
                              {t('regMasCalc.questions.q4.select.options.visado')}
                            </option>
                            <option value="turismo">
                              {t('regMasCalc.questions.q4.select.options.turismo')}
                            </option>
                            <option value="arraigo">
                              {t('regMasCalc.questions.q4.select.options.arraigo')}
                            </option>
                          </select>
                        </div>
                        {situacion !== '' && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q4.success')}
                          </div>
                        )}
                      </div>
                      {/** q5 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q5.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q5.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q5.help')}</p>
                        <div className="flex align-center justify-start gap-x-4 mt-[14px]">
                          <button
                            type="button"
                            className={[
                              'btn-success cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white',
                              familia === true ? 'bg-[#22c55e]' : 'bg-[#22c55e]/50',
                            ].join(' ')}
                            aria-pressed={familia === true}
                            onClick={() =>
                              setValue('familia', true, { shouldDirty: true, shouldValidate: true })
                            }
                          >
                            {t('regMasCalc.questions.q5.options.yes')}
                          </button>
                          <button
                            type="button"
                            className={[
                              'btn-danger cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white',
                              familia === false ? 'bg-[#ef4444]' : 'bg-[#ef4444]/50',
                            ].join(' ')}
                            aria-pressed={familia === false}
                            onClick={() =>
                              setValue('familia', false, {
                                shouldDirty: true,
                                shouldValidate: true,
                              })
                            }
                          >
                            {t('regMasCalc.questions.q5.options.no')}
                          </button>
                        </div>
                        {familia && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q5.success')}
                          </div>
                        )}
                      </div>
                      {/** q6 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q6.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q6.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q6.help')}</p>
                        <div className="flex align-center justify-left gap-x-4 mt-[14px]">
                          <input
                            className="border border-solid border-[#bec8d0] box-border bg-none m-0 block min-w-0 rounded-[8px] w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                            type="text"
                            {...register('nacionalidad', { required: true })}
                          />
                        </div>
                        {nacionalidad !== '' && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q6.success')}
                          </div>
                        )}
                      </div>
                      {/** q7 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q7.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q7.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q7.help')}</p>
                        <div className="flex align-center justify-left gap-x-4 mt-[14px]">
                          <select
                            id="provincia"
                            className="border border-solid border-[#bec8d0] box-border bg-none m-0 block min-w-0 rounded-[8px] w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                            {...register('provincia', { required: true })}
                          >
                            <option value="">
                              {t('regMasCalc.questions.q7.select.placeholder')}
                            </option>
                            <option value="Álava">Álava</option>
                            <option value="Albacete">Albacete</option>
                            <option value="Alicante">Alicante</option>
                            <option value="Almería">Almería</option>
                            <option value="Asturias">Asturias</option>
                            <option value="Ávila">Ávila</option>
                            <option value="Badajoz">Badajoz</option>
                            <option value="Barcelona">Barcelona</option>
                            <option value="Burgos">Burgos</option>
                            <option value="Cáceres">Cáceres</option>
                            <option value="Cádiz">Cádiz</option>
                            <option value="Cantabria">Cantabria</option>
                            <option value="Castellón">Castellón</option>
                            <option value="Ciudad Real">Ciudad Real</option>
                            <option value="Córdoba">Córdoba</option>
                            <option value="Cuenca">Cuenca</option>
                            <option value="Girona">Girona</option>
                            <option value="Granada">Granada</option>
                            <option value="Guadalajara">Guadalajara</option>
                            <option value="Guipúzcoa">Guipúzcoa</option>
                            <option value="Huelva">Huelva</option>
                            <option value="Huesca">Huesca</option>
                            <option value="Islas Baleares">Islas Baleares</option>
                            <option value="Jaén">Jaén</option>
                            <option value="La Coruña">La Coruña</option>
                            <option value="La Rioja">La Rioja</option>
                            <option value="Las Palmas">Las Palmas</option>
                            <option value="León">León</option>
                            <option value="Lleida">Lleida</option>
                            <option value="Lugo">Lugo</option>
                            <option value="Madrid">Madrid</option>
                            <option value="Málaga">Málaga</option>
                            <option value="Murcia">Murcia</option>
                            <option value="Navarra">Navarra</option>
                            <option value="Ourense">Ourense</option>
                            <option value="Palencia">Palencia</option>
                            <option value="Pontevedra">Pontevedra</option>
                            <option value="Salamanca">Salamanca</option>
                            <option value="Santa Cruz de Tenerife">Santa Cruz de Tenerife</option>
                            <option value="Segovia">Segovia</option>
                            <option value="Sevilla">Sevilla</option>
                            <option value="Soria">Soria</option>
                            <option value="Tarragona">Tarragona</option>
                            <option value="Teruel">Teruel</option>
                            <option value="Toledo">Toledo</option>
                            <option value="Valencia">Valencia</option>
                            <option value="Valladolid">Valladolid</option>
                            <option value="Vizcaya">Vizcaya</option>
                            <option value="Zamora">Zamora</option>
                            <option value="Zaragoza">Zaragoza</option>
                          </select>
                        </div>
                        {provincia !== '' && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q7.success')}
                          </div>
                        )}
                      </div>
                      {/** q8 */}
                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <span className="font-semibold tracking-[2px] text-[12px] uppercase">
                          {t('regMasCalc.questions.q8.tag')}
                        </span>
                        <h3 className="font-bold leading-[28px] mt-[8px] text-[21px]">
                          {t('regMasCalc.questions.q8.title')}
                        </h3>
                        <p className="mt-[14px] text-[14px]">{t('regMasCalc.questions.q8.help')}</p>
                        <div className="flex align-center justify-left gap-x-4 mt-[14px]">
                          <textarea
                            className="border border-solid border-[#bec8d0] box-border bg-none m-0 block min-w-0 rounded-[8px] w-full p-[14px] disabled:bg-[#f3f5f7] disabled:text-[#dbe0e5] disabled:rounded-[8px] bg-transparent"
                            style={{ resize: 'none' }}
                            rows={4}
                            {...register('comentarios')}
                          />
                        </div>
                        {!!comentarios?.trim() && (
                          <div className="mt-[14px] text-[14px]">
                            {t('regMasCalc.questions.q8.success')}
                          </div>
                        )}
                      </div>

                      <div className="bg-white box-border w-full relative rounded-[8px] border border-solid border-[#bec8d0] p-4">
                        <div className="flex align-center justify-start gap-x-4">
                          <button
                            type="button"
                            className="bg-[#0ea5e9] btn-primary cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white disabled:opacity-50"
                            disabled={!isEvaluateReady || hasEvaluated}
                            onClick={evaluate}
                          >
                            {hasEvaluated
                              ? t('regMasCalc.actions.evaluated')
                              : t('regMasCalc.actions.evaluate')}
                          </button>
                          <button
                            type="button"
                            className="bg-[#64748b] btn-danger cursor-pointer flex items-center justify-center px-[10px] py-[6px] rounded-[4px] text-white disabled:opacity-50"
                            onClick={onReset}
                          >
                            {t('regMasCalc.actions.reset')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[410px]">
                <div
                  className="box-border flex flex-wrap ml-[-24px] text-[#5b6b79]"
                  style={{ width: 'calc(100% + 24px)' }}
                >
                  <div className="box-border m-0 basis-[100%] grow-0 min-w-[100%] pl-6 pt-3">
                    <div className="flex flex-col gap-y-4">
                      <div
                        className={[
                          'box-border w-full relative rounded-[8px] border border-solid p-4',
                          !hasEvaluated
                            ? 'bg-white border-[#bec8d0]'
                            : score >= 3
                              ? 'bg-[#E8F5E9] border-[#C5E1A5]'
                              : 'bg-[#FFF3E0] border-[#FFCC80]',
                        ].join(' ')}
                      >
                        {/** Calculando */}
                        {(!hasEvaluated || isCalculating) && (
                          <div className="flex flex-col align-center justify-start ">
                            <h3 className="font-bold text-[18px] text-center text-[#2E7D32]">
                              {t('regMasCalc.calculating.title')}
                            </h3>
                            <p className="text-center text-[24px]">🕑 🤔 🕗</p>
                          </div>
                        )}
                        {/** Aplica */}
                        {hasEvaluated && score >= 3 && (
                          <div className="flex flex-col align-center justify-start ">
                            <p className="text-center text-[24px]">🥳🥳🥳</p>
                            <h3 className="font-bold text-[18px] text-center text-[#2E7D32]">
                              {t('regMasCalc.results.eligible.title')}
                            </h3>
                            <p className="text-center text-[24px]">🥳🥳🥳</p>
                            <p className="mt-[14px]">{t('regMasCalc.results.eligible.intro')}</p>
                            <p className="mt-[14px]">
                              {t('regMasCalc.results.eligible.recommendationsTitle')}
                            </p>
                            <ol className="list-decimal mt-[14px] pl-5">
                              <li>{t('regMasCalc.results.eligible.recommendations.r1')}</li>
                              <li className="mt-[10px]">
                                {t('regMasCalc.results.eligible.recommendations.r2')}
                              </li>
                              <li className="mt-[10px]">
                                {t('regMasCalc.results.eligible.recommendations.r3')}
                              </li>
                              <li className="mt-[10px]">
                                {t('regMasCalc.results.eligible.recommendations.r4')}
                              </li>
                              <li className="mt-[10px]">
                                {t('regMasCalc.results.eligible.recommendations.r5')}
                              </li>
                              <li className="mt-[10px]">
                                {t('regMasCalc.results.eligible.recommendations.r6')}
                              </li>
                              <li className="mt-[10px]">
                                {t('regMasCalc.results.eligible.recommendations.r7')}
                              </li>
                            </ol>
                          </div>
                        )}
                        {/** No Aplica */}
                        {hasEvaluated && score < 3 && (
                          <div className="flex flex-col align-center justify-start">
                            <p className="text-center text-[24px]">🤔🕜🤔</p>
                            <h3 className="font-bold text-[18px] text-center text-[#2E7D32]">
                              {t('regMasCalc.results.notEligible.title')}
                            </h3>
                            <p className="text-center text-[24px]">🤔🕜🤔</p>
                            <p className="mt-[14px]">{t('regMasCalc.results.notEligible.intro')}</p>
                            <p className="mt-[14px]">{t('regMasCalc.results.notEligible.body')}</p>
                          </div>
                        )}
                        {/** Formulario */}
                        {hasEvaluated && (
                          <div className="flex flex-col align-center justify-start">
                            <div className="flex flex-col mt-[14px]">
                              <label
                                htmlFor="name"
                                className="text-xs font-semibold p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                              >
                                {t('regMasCalc.leadForm.nameLabel')}
                              </label>
                              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                                  <InputText
                                    id="name"
                                    type="text"
                                    className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                                    placeholder={t('regMasCalc.leadForm.namePlaceholder')}
                                    {...register('name', { required: true })}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col mt-[14px]">
                              <label
                                htmlFor="email"
                                className="text-xs font-semibold p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                              >
                                {t('regMasCalc.leadForm.emailLabel')}
                              </label>
                              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                                  <InputText
                                    id="email"
                                    type="text"
                                    className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                                    placeholder={t('regMasCalc.leadForm.emailPlaceholder')}
                                    {...register('email', { required: true })}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col mt-[14px]">
                              <label
                                htmlFor="phone"
                                className="text-xs font-semibold p-0 relative block whitespace-nowrap overflow-hidden max-w-[100%]"
                              >
                                {t('regMasCalc.leadForm.phoneLabel')}
                              </label>
                              <div className="inline-flex flex-col relative min-w-0 p-0 border-0 align-top w-full mb-2 mt-2">
                                <div className="box-border inline-flex w-full relative rounded-[8px] border border-solid border-[#bec8d0] h-12">
                                  <InputText
                                    id="phone"
                                    type="text"
                                    className="bg-white border-0! box-border bg-none m-0 block min-w-0 w-full p-[14px]"
                                    placeholder={t('regMasCalc.leadForm.phonePlaceholder')}
                                    {...register('phone', { required: true })}
                                  />
                                </div>
                              </div>
                            </div>
                            <p className="mt-[14px]">{t('regMasCalc.leadForm.benefits.b1')}</p>
                            <p className="mt-[10px]">{t('regMasCalc.leadForm.benefits.b2')}</p>
                            <p className="mt-[10px]">{t('regMasCalc.leadForm.benefits.b3')}</p>
                            <p className="mt-[10px]">{t('regMasCalc.leadForm.benefits.b4')}</p>
                            <p className="mt-[10px]">{t('regMasCalc.leadForm.benefits.b5')}</p>
                            <button
                              className={[
                                'bg-[#22c55e] btn-success cursor-pointer flex items-center justify-center mt-[14px] px-[10px] py-[6px] rounded-[4px] text-center text-white',
                                'disabled:bg-[#22c55e]/50 cursor-not-allowed',
                              ].join(' ')}
                              type="submit"
                            >
                              {t('regMasCalc.leadForm.submit')}
                            </button>
                            <Link
                              href="https://odiseo.extranjeriagrv.es/calendar/reserva"
                              className="bg-[#CC3366] btn-success cursor-pointer flex items-center justify-center mt-[14px] px-[10px] py-[6px] rounded-[4px] text-center text-white"
                            >
                              {t('regMasCalc.leadForm.bookCta')}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Toast ref={toast} />
    </>
  );
};

export default RegMasCalc;
