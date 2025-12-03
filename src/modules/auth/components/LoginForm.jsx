import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../utils/errors/getErrorMessage';

function LoginForm({ insideModal = false }) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const signinResponse = await singin(formData.username, formData.password);

      if (!signinResponse.success) {
        const mensaje = getErrorMessage(
          signinResponse.errorCode,
          signinResponse.message,
        );

        Swal.fire({
          icon: 'error',
          title: 'No se pudo iniciar sesión',
          text: mensaje,
        });

        setError(mensaje);

        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: 'Has ingresado correctamente.',
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
        label="Contraseña"
        {...register('password', {
          required: 'Contraseña es obligatorio',
        })}
        type="password"
        error={errors.password?.message}
      />

      <Button type="submit">Iniciar Sesión</Button>
      {!insideModal && (
        <Button variant="secondary" onClick={() => navigate('/signup')}>
          Registrar Usuario
        </Button>
      )}
    </form>
  );
}

export default LoginForm;
