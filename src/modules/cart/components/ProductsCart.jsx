import { Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../../stores/useCartStore';

function ProductsCart() {
  const { products, updateQuantity, clearProduct } = useCartStore();

  if (products.length === 0) {
    return (
      <div className="flex-1 text-center text-gray-500 text-lg">
        Tu carrito está vacío.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      {products.map((item) => (
        <div
          key={item.id}
          className="bg-white border rounded-xl shadow-sm px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h3 className="text-base sm:text-lg font-semibold">{item.name}</h3>
            <div className="flex gap-10 mt-2 text-gray-600 text-base sm:text-lg">
              <span>Cantidad: {item.quantity}</span>
              <span>Sub Total: ${item.price * item.quantity}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-base sm:text-lg">
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
              className="ml-4 px-4 py-2 rounded-lg bg-purple-200 text-sm sm:text-base"
              onClick={() => clearProduct(item.id)}
            >Borrar
            </button>
          </div>
        </div>

      ))}
    </div>
  );
}

export default ProductsCart;