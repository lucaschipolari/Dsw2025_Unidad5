import React from "react";
import { Minus, Plus } from "lucide-react";
import Button from "../../shared/components/Button";

import { useCartStore, useTotalPrice } from "../../../stores/useCartStore";
import useAuth from "../../auth/hook/useAuth";
import Swal from "sweetalert2";
import { postOrders } from "../services/cartOrdes";

const Cart = () => {
  const { products, updateQuantity, clearCart } = useCartStore();
  const totalPrice = useTotalPrice();
  const { isAuthenticated, user } = useAuth();

  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);

 const handleBuy = async () => {
  if (!isAuthenticated) {
    Swal.fire({
      icon: "warning",
      title: "Debes iniciar sesión",
      text: "Inicia sesión para continuar con la compra.",
    });
    return;
  } console.log (user)

  if (products.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Tu carrito está vacío",
    });
    return;
  }

  // Construcción de orderItems
  const orderItems = products.map((item) => ({
    quantity: item.quantity,
    productId: item.id,
    name: item.name,
    description: item.description ?? "",
    unitPrice: item.price,
  }));

  // Payload final
  const payload = {
    customerId: user.id ?? user.userId ?? user.sub, // soporte a distintos formatos
    shippingAddress: user.shippingAddress ?? "",
    billingAddress: user.billingAddress ?? "",
    orderItems,
  };

  try { const response = await postOrders (payload);

    if (!response.ok) {
      throw new Error("Error en la creación del pedido");
    }

    Swal.fire({
      icon: "success",
      title: "Pedido creado",
      text: "Tu compra ha sido procesada correctamente.",
    });

    clearCart();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error al procesar el pedido",
      text: error.message,
    });
  }
};

  return (
    <div className="mx-10 my-10">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* IZQUIERDA: Productos del carrito */}
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
              {/* Información del producto */}
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>

                <div className="flex gap-10 mt-2 text-gray-600">
                  <span>Cantidad: {item.quantity}</span>
                  <span>Sub Total: ${item.price * item.quantity}</span>
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center gap-3">

                {/* Decrementar */}
                <button
                  className="h-8 w-8 rounded-full border flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Minus size={16} />
                </button>

                <span className="w-6 text-center">{item.quantity}</span>

                {/* Incrementar */}
                <button
                  className="h-8 w-8 rounded-full border flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, +1)}
                >
                  <Plus size={16} />
                </button>

                {/* Borrar */}
                <button
                  className="ml-4 px-4 py-2 rounded-lg bg-purple-200 text-sm"
                  onClick={() => updateQuantity(item.id, -item.quantity)}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DERECHA: Detalle de pedido */}
        <div className="w-full lg:w-80 bg-white border rounded-xl shadow-sm px-6 py-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold">Detalle de pedido</h2>

            <p className="mt-4 text-gray-600">
              Cantidad total: {totalItems}
            </p>

            <p className="mt-2 text-gray-600">
              Total a pagar: ${totalPrice}
            </p>
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
            onClick={clearCart}
          >
            Vaciar Carrito
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
