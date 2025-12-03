import { Minus, Plus } from 'lucide-react';
import Button from '../../shared/components/Button';
import { useState } from 'react';
import { useCartStore, useTotalPrice } from '../../../stores/useCartStore';
import useAuth from '../../auth/hook/useAuth';
import Swal from 'sweetalert2';
import { postOrders } from '../services/cartOrders';
import ModalLogin from '../../auth/components/ModalLogin';
import ModalRegister from '../../auth/components/ModalRegister';
import { getErrorMessage } from '../../utils/errors/getErrorMessage';

const Cart = () => {
  const { products, updateQuantity, clearCart, clearProduct } = useCartStore();
  const totalPrice = useTotalPrice();
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState();

  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);

  const handleLimpiarCarrito = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminarán todos los productos del carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();

        Swal.fire({
          title: 'Carrito limpio',
          text: 'El carrito ha sido eliminado correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };
  const handleBuy = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);

      return;
    }

    if (products.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Tu carrito está vacío',
      });

      return;
    }

    const orderItems = products.map((item) => ({
      quantity: item.quantity,
      productId: item.id,
      name: item.name,
      description: item.description ?? '',
      unitPrice: item.price,
    }));

    const payload = {
      customerId: user.customerId, // soporte a distintos formatos
      shippingAddress: user.shippingAddress ?? 'shipping',
      billingAddress: user.billingAddress ?? 'billing',
      orderItems,
    };

    try {
      const response = await postOrders(payload);

      if (!response.success) {
        const mensaje = getErrorMessage(response.errorCode, response.message);

        Swal.fire({
          icon: 'error',
          title: 'No se pudo crear el pedido',
          text: mensaje,
        });

        setError(mensaje);

        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Pedido creado',
        text: 'Tu compra ha sido procesada correctamente.',
      });
      localStorage.removeItem('cart-storage');
      clearCart();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar el pedido',
        text: error.message,
      });
    }
  };

  return (
    <div className="mx-10 my-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {products.length === 0 && (
            <div className="text-center text-gray-500 text-lg">
              Tu carrito está vacío.
            </div>
          )}
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl shadow-sm px-6 py-5 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <div className="flex gap-10 mt-2 text-gray-600">
                  <span>Cantidad: {item.quantity}</span>
                  <span>Sub Total: ${item.price * item.quantity}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="h-8 w-8 rounded-full border flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  className="h-8 w-8 rounded-full border flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, +1)}
                >
                  <Plus size={16} />
                </button>
                <button
                  className="ml-4 px-4 py-2 rounded-lg bg-purple-200 text-sm"
                  onClick={() => clearProduct(item.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-80 bg-white border rounded-xl shadow-sm px-6 py-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">Detalle de pedido</h2>

            <p className="mt-4 text-gray-600">Cantidad total: {totalItems}</p>

            <p className="mt-2 text-gray-600">Total a pagar: ${totalPrice}</p>
          </div>
          <button
            className="mt-6 w-full py-2 rounded-lg bg-purple-200"
            disabled={products.length === 0}
            onClick={handleBuy}
          >
            Finalizar Compra
          </button>
          <Button
            className="mt-4 w-full py-2 bg-red-300"
            onClick={handleLimpiarCarrito}
          >
            Vaciar Carrito
          </Button>
        </div>
      </div>
      <ModalLogin
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitch={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <ModalRegister
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitch={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

export default Cart;
