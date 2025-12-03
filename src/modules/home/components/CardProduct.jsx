import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import Button from '../../shared/components/Button';
import { useCartStore } from '../../../stores/useCartStore';

const CardProduct = ({ product }) => {
  const { addProduct, products, updateQuantity } = useCartStore();

  // Verificar si ya existe en el carrito
  const cartProduct = products.find((p) => p.id === product.id);

  // Estado local para la cantidad a agregar
  const [quantity, setQuantity] = useState(1);

  // Si el producto ya está en carrito, sincronizar cantidad
  useEffect(() => {
    if (cartProduct) {
      setQuantity(cartProduct.quantity);
    }
  }, [cartProduct]);

  const handleIncrement = () => {
    if (cartProduct) {
      updateQuantity(product.id, +1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartProduct) {
      updateQuantity(product.id, -1);
    } else {
      if (quantity > 1) setQuantity(quantity - 1);
    }
  };

  const handleAdd = () => {
    addProduct({
      ...product,
      price: product.currentUnitPrice,
      quantity,
    });
  };

  return (
    <div className="border p-5 rounded-2xl">
      <div className="h-96 w-auto flex justify-center items-center">
        <img
          src="/noimg.png"
          className="h-full object-contain"
          alt="Sin imagen"
        />
      </div>

      <div className="mt-3 text-lg font-semibold">{product.name}</div>

      <div className="flex flex-row justify-between items-center mt-4">
        <div className="text-xl font-bold">
          ${product.currentUnitPrice}
        </div>

        <div className="flex flex-row items-center gap-3">

          <div className="flex flex-row items-center border rounded-lg px-3 py-1">
            <Minus
              className="cursor-pointer"
              onClick={handleDecrement}
            />

            <input
              type="number"
              className="h-10 w-12 text-center outline-none"
              value={quantity}
              onChange={(e) => {
                const q = Number(e.target.value);

                if (q > 0) {
                  if (cartProduct) {
                    const diff = q - cartProduct.quantity;

                    updateQuantity(product.id, diff);
                  }

                  setQuantity(q);
                }
              }}
            />

            <Plus
              className="cursor-pointer"
              onClick={handleIncrement}
            />
          </div>

          <Button onClick={handleAdd}>Agregar</Button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
