import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Select from '../../shared/components/Select';
import useAuth from '../hook/useAuth';
import { getErrorMessage } from '../../utils/errors/getErrorMessage';
import Swal from 'sweetalert2';

function RegisterForm({ insideModal = false }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, singin } = useAuth();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      role: 'customer',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      // 1. Registrar usuario
      const signupResponse = await signup(formData);

      if (!signupResponse.success) {
        const mensaje = getErrorMessage(
          signupResponse.errorCode,
          signupResponse.message,
        );

        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: mensaje,
        });

        setError(mensaje);

        return;
      }

      // 2. Iniciar sesión automáticamente
      const signinResponse = await singin(formData.username, formData.password);

      if (!signinResponse.success) {
        const mensaje = getErrorMessage(
          signinResponse.errorCode,
          signinResponse.message,
        );

        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: mensaje,
        });

        setError(mensaje);

        return;
      }

      // 3. Redirigir si todo salió bien
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada y has iniciado sesión correctamente.',
      });

      navigate('/admin/home');
    } catch (error) {
      const mensaje = error?.response?.data?.code
        ? getErrorMessage(error.response.data.code, error.response.data.message)
        : 'Contactar a Soporte';

      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: mensaje,
      });

      setError(mensaje);
    }
  };

  return (
    <form
      className={`
      flex flex-col
      ${
    insideModal
      ? 'gap-4 p-0 m-0 w-full text-lg'
      : 'gap-20 p-8 m-4 sm:gap-4 bg-white sm:rounded-lg sm:shadow-lg'
    }
  `}
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label="Usuario"
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />
      <Input
        label="Email"
        {...register('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: 'Formato de email incorrecto',
          },
        })}
        error={errors.email?.message}
      />
      {location.pathname === '/signup' && (
        <Select
          label="Role"
          options={[
            { value: 'customer', label: 'Cliente' },
            { value: 'admin', label: 'Administrador' },
            { value: 'seller', label: 'Vendedor' },
          ]}
          {...register('role', { required: 'Seleccione un rol' })}
          error={errors.role?.message}
        />
      )}
      <Input
        label="Contraseña"
        {...register('password', {
          required: 'Contraseña es obligatorio',
          minLength: {
            value: 8,
            message: 'La contraseña debe tener al menos 8 caracteres',
          },
        })}
        type="password"
        error={errors.password?.message}
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        {...register('confirmPassword', {
          required: 'Debe confirmar la contraseña',
          validate: (value) =>
            value === watch('password') || 'Las contraseñas deben coincidir',
        })}
        error={errors.confirmPassword?.message}
      />
      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Registrar Usuario'}
      </Button>
      {!insideModal && (
        <Button variant="secondary" onClick={() => navigate('/login')}>
          Inicio de Sesión
        </Button>
      )}
    </form>
  );
}

export default RegisterForm;
