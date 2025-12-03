import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../../utils/errors/getErrorMessage';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      const response = await createProduct(formData);

      if (!response.success) {
        const mensaje = getErrorMessage(response.errorCode, response.message);

        Swal.fire({
          icon: 'error',
          title: 'No se pudo crear el producto',
          text: mensaje,
        });

        setError(mensaje);

        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Producto creado',
        text: 'El producto se ha registrado correctamente.',
      });

      navigate('/admin/products');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Contactar a Soporte',
      });

      setError('Contactar a Soporte');
    }
  };

  return (
    <Card>
      <form
        className="flex flex-col gap-20 p-8 sm:gap-4"
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label="SKU"
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
          })}
        />
        <Input
          label="Código Único"
          error={errors.cui?.message}
          {...register('cui', {
            required: 'Código Único es requerido',
          })}
        />
        <Input
          label="Nombre"
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />
        <Input label="Descripción" {...register('description')} />
        <Input
          label="Precio"
          error={errors.price?.message}
          type="number"
          {...register('price', {
            min: {
              value: 0,
              message: 'No puede tener un precio negativo',
            },
          })}
        />
        <Input
          label="Stock"
          error={errors.stock?.message}
          {...register('stock', {
            min: {
              value: 0,
              message: 'No puede tener un stock negativo',
            },
          })}
        />
        <div className="sm:text-end">
          <Button type="submit" className="w-full sm:w-fit">
            Crear Producto
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default CreateProductForm;
