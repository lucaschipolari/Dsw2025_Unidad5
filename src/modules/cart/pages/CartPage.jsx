import { useState } from 'react';
import { useCartStore, useTotalPrice } from '../../../stores/useCartStore';
import useAuth from '../../auth/hook/useAuth';
import Swal from 'sweetalert2';
import { postOrders } from '../services/cartOrders';
import ModalLogin from '../../auth/components/ModalLogin';
import ModalRegister from '../../auth/components/ModalRegister';
import { getErrorMessage } from '../../utils/errors/getErrorMessage';
import ProductsCart from  '../components/ProductsCart';
import TotalAmountCart from '../components/TotalAmountCart';

const Cart = () => {
  const { products, clearCart } = useCartStore();
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
      customerId: user.customerId,
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
        <ProductsCart />
        <TotalAmountCart
          totalItems={totalItems}
          totalPrice={totalPrice}
          productsLength={products.length}
          onBuy={handleBuy}
          onClear={handleLimpiarCarrito}
        />
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
