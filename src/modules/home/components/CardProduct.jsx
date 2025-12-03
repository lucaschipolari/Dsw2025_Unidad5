import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import Button from '../../shared/components/Button';
import { useCartStore } from '../../../stores/useCartStore';

const CardProduct = ({ product }) => {
  const { addProduct, products } = useCartStore();

  const cartProduct = products.find((p) => p.id === product.id);

  const [quantity, setQuantity] = useState(0);

  // useEffect(() => {
  //   if (cartProduct) {
  //     setQuantity(cartProduct.quantity);
  //   }
  // }, [cartProduct]);

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
    if (product.stockQuantity > 0 && quantity > 0) {
      addProduct({
        ...product,
        price: product.currentUnitPrice,
        quantity,
      });
      // 👇 después de agregar, reseteamos el input
      setQuantity(0);
    }
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
        <div className="text-xl font-bold">${product.currentUnitPrice}</div>

        {product.stockQuantity === 0 ? (
          <div className="text-red-500 font-semibold">Sin stock</div>
        ) : (
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center border rounded-lg px-3 py-1">
              <Minus className="cursor-pointer" onClick={handleDecrement} />

              <input
                type="number"
                className="h-10 w-12 text-center outline-none"
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
            <Button onClick={handleAdd}>Agregar</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProduct;
