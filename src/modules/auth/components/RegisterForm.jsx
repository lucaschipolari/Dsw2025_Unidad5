import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Select from '../../shared/components/Select';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const { signup, singin } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      const { error } = await signup(formData);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }

      try {

        const { error } = await singin(formData.username, formData.password);

        if (error) {
          setErrorMessage(error.frontendErrorMessage);

          return;
        }

        navigate('/admin/home');

      } catch (error) {
        if (error?.response?.data?.code) {
          setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
        } else {
          setErrorMessage('Error al intentar registrar. Llame a soporte');
        }
      }
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Error al intentar registrar. Llame a soporte');
      }
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-20
        bg-white
        p-8
        m-4
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      '
    onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
      />
      <Input
        label='Email'
        { ...register('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'Formato de email incorrecto',
          },
        }) }
        error={errors.email?.message}
      />
      <Select
        label='Role'
        options={[ { value: 'CUSTOMER', label: 'Cliente' }, { value: 'ADMIN', label: 'Administrador' }, { value: 'SELLER', label: 'Vendedor' } ]}
        { ...register('role', { required: 'Seleccione un rol' }) }
        error={errors.role?.message}
      />
      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatorio',
          minLength: {
            value: 8,
            message: 'La contraseña debe tener al menos 8 caracteres',
          },
        }) }
        type='password'
        error={errors.password?.message}
      />
      <Input
        label='Confirmar contraseña'
        type='password'
        { ...register('confirmPassword', {
          required: 'Debe confirmar la contraseña',
          validate: (value) =>
            value === watch('password') || 'Las contraseñas deben coincidir',
        }) }
        error={errors.confirmPassword?.message}
      />
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

      <Button type='submit'>Registrar Usuario</Button>
      <Button variant='secondary' onClick={() => navigate('/login')}>Inicio de Sesión</Button>
    </form>
  );
};

export default RegisterForm;