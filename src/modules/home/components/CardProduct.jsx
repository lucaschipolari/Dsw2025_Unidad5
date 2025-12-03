import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import Button from '../../shared/components/Button';
import { useCartStore } from '../../../stores/useCartStore';
import Swal from 'sweetalert2';

const CardProduct = ({ product }) => {
  const { addProduct, products } = useCartStore();

  const cartProduct = products.find((p) => p.id === product.id);
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    const currentInCart = cartProduct ? cartProduct.quantity : 0;

    if (currentInCart + quantity > product.stockQuantity) {
      Swal.fire({
        icon: 'info',
        title: 'No hay suficiente stock para agregar más al carrito',
        text: `Solo hay ${
          product.stockQuantity - currentInCart
        } unidad(es) disponibles.`,
      });

      return;
    }

    // Agregar si hay stock
    addProduct({
      ...product,
      price: product.currentUnitPrice,
      quantity,
    });

    Swal.fire({
      icon: 'success',
      title: 'Producto agregado',
      text: `Se agregaron ${quantity} unidad(es) de "${product.name}" al carrito.`,
      confirmButtonText: 'OK',
    });

    setQuantity(1);
  };

  return (
    <div className="relative border p-5 rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      {cartProduct && cartProduct.quantity > 0 && (
        <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full shadow-md whitespace-nowrap">
          <div className="flex items-center gap-1">
            <span>{cartProduct.quantity}</span>
            <ShoppingCart className="h-4 w-4" />
          </div>
        </div>
      )}

      <div className="h-60 sm:h-72 md:h-80 lg:h-96 w-full flex justify-center items-center overflow-hidden">
        <img
          src="/noimg.png"
          className="max-h-full max-w-full object-contain"
          alt="Sin imagen"
        />
      </div>

      <div className="mt-3 text-lg font-semibold text-center">
        {product.name}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-xl font-bold">${product.currentUnitPrice}</div>

        {product.stockQuantity === 0 ? (
          <div className="text-red-500 font-semibold">Sin stock</div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-3">
            <div className="flex items-center border rounded-lg px-3 py-1 min-w-[150px]">
              <Minus className="cursor-pointer" onClick={handleDecrement} />

              <input
                type="number"
                className="h-10 w-14 text-center outline-none mx-2
             [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [appearance:textfield]"
                value={quantity}
                onChange={(e) => {
                  const q = Number(e.target.value);

                  if (q >= 0 && q <= product.stockQuantity) {
                    setQuantity(q);
                  }
                }}
              />

              <Plus
                className={
                  quantity < product.stockQuantity
                    ? 'cursor-pointer text-blue-500 hover:text-blue-700'
                    : 'text-gray-400 cursor-not-allowed'
                }
                onClick={
                  quantity < product.stockQuantity ? handleIncrement : undefined
                }
              />
            </div>
            <Button onClick={handleAdd} className="text-sm h-10 w-20">
              Agregar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProduct;
