'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';

import { useAuth } from '@/auth/hooks/useAuth';
import { LoadingScreen } from '@/components/atoms';

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [keepSession, setKeepSession] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({ mode: 'onChange' });

  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);
    try {
      await login(data.email, data.password, keepSession);
      router.replace('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(true);
    }
  }

  useEffect(() => {
    const lastUser = localStorage.getItem('lastUser');
    if (lastUser) {
      const { email, password } = JSON.parse(lastUser);
      setValue('email', email);
      setValue('password', password);
      setKeepSession(true);
    }
  }, []);
  
  return (
    <>
      {submitting && <LoadingScreen />}
      <div className="m-6 max-w-[540px]">
        <div className="p-10">
          <div className="box-border flex flex-row flex-wrap w-full">
            <div className="pt-6 sm:basis-full flex-grow-0 max-w-full">
              <div className="align-baseline flex flex-row justify-between">
                <h3 className="m-0 font-semibold leading-6 text-2xl ">Identificarse</h3>
              </div>
            </div>
            <div className="pt-6 sm:basis-full flex-grow-0 max-w-full">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <div className="box-border flex flex-row flex-wrap">
                  <div className="box-border m-0 pt-6 lg:basis-full lg:flex-grow-0 lg:max-w-full">
                    <div className="flex flex-col gap-y-2">
                      <label className="text-gray-500" htmlFor="email">
                        Correo electrónico
                      </label>
                      <InputText
                        aria-describedby="email-help"
                        id="email"
                        placeholder='Correo electrónico'
                        type="email"
                        {...register('email', { 
                          required: 'Este campo es obligatorio',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Por favor, ingresa un correo electrónico válido'
                          }

                        })}
                      />
                      {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
                    </div>
                  </div>
                  <div className="box-border m-0 pt-6 lg:basis-full lg:flex-grow-0 lg:max-w-full">
                    <div className="flex flex-col gap-y-2">
                      <label className="text-gray-500" htmlFor="password">
                        Contraseña
                      </label>
                      <InputText
                        aria-describedby="password-help"
                        id="password"
                        placeholder="********"
                        type='password'
                        {...register('password', { required: 'Este campo es obligatorio' })}
                      />
                      {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
                    </div>
                  </div>
                  <div className="box-border m-0 pt-10 lg:basis-full lg:flex-grow-0 lg:max-w-full">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex gap-x-3 items-center">
                        <Checkbox
                          inputId="keepSession"
                          name="keepSession"
                          value={keepSession}
                          onChange={() => setKeepSession(!keepSession)}
                          checked={keepSession}
                        />
                        <label className='text-gray-600' htmlFor='keepSession'>
                          Mantener la sesión
                        </label>
                      </div>
                      <Link
                        className='text-gray-600'
                        href="/forgot-password"
                      >
                        Olvidé mi contraseña
                      </Link>
                    </div>
                  </div>
                  <div className="box-border m-0 pt-10 lg:basis-full lg:flex-grow-0 lg:max-w-full">
                    <Button
                      className='w-full'
                      label="Login"
                      type="submit"
                      disabled={!isValid || submitting}
                      loading={submitting}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login

