import Button from '../../shared/components/Button';

function TotalAmountCart( props ) {
  const { totalItems, totalPrice, productsLength, onBuy, onClear } = props;

  return (
    <div className="w-full lg:w-80 bg-white border rounded-xl shadow-sm px-6 py-6 flex flex-col justify-between">
      <div>
        <h2 className="text-base sm:text-xl font-semibold">Detalle de pedido</h2>

        <p className="mt-4 text-gray-600 text-base sm:text-lg">
          Cantidad total: {totalItems}
        </p>
        <p className="mt-2 text-gray-600 text-base sm:text-lg">
          Total a pagar: ${totalPrice}
        </p>
      </div>

      <button
        className="mt-6 w-full py-2 rounded-lg bg-purple-200 text-base sm:text-lg"
        disabled={productsLength === 0}
        onClick={onBuy}
      >
        Finalizar Compra
      </button>

      <Button
        className="mt-4 w-full py-2 bg-red-300 text-base sm:text-lg"
        onClick={onClear}
      >
        Vaciar Carrito
      </Button>
    </div>
  );
}

export default TotalAmountCart;
