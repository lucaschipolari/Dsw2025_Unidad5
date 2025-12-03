import Swal from 'sweetalert2';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => {
          const existingProductIndex = state.products.findIndex(
            (p) => p.id === product.id,
          );

          if (existingProductIndex >= 0) {
            const updateProducts = [...state.products];
            const existing = updateProducts[existingProductIndex];

            // nueva cantidad calculada
            let newQuantity = existing.quantity + product.quantity;

            // validación: no superar stock
            if (newQuantity > product.stockQuantity) {
              newQuantity = product.stockQuantity;
              Swal.fire({
                icon: 'info',
                title: 'Stock máximo alcanzado',
                text: `No puedes agregar más de ${product.stockQuantity} unidades.`,
              });
            }

            updateProducts[existingProductIndex] = {
              ...existing,
              quantity: newQuantity,
            };

            return { products: updateProducts };
          } else {
            // validación: no superar stock
            let finalQuantity = product.quantity;

            if (finalQuantity > product.stockQuantity) {
              finalQuantity = product.stockQuantity;
              Swal.fire({
                icon: 'info',
                title: 'Stock máximo alcanzado',
                text: `No puedes agregar más de ${product.stockQuantity} unidades.`,
              });
            }

            return {
              products: [
                ...state.products,
                { ...product, quantity: finalQuantity },
              ],
            };
          }
        }),

      updateQuantity: (id, increment) =>
        set((state) => {
          return {
            products: state.products.map((product) => {
              if (product.id === id) {
                if (product.quantity === 1 && increment === -1) {
                  Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Estás a punto de eliminar el producto del carrito.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      set((state) => ({
                        products: state.products.filter((p) => p.id !== id),
                      }));
                      Swal.fire(
                        'Eliminado',
                        'El producto ha sido eliminado.',
                        'success',
                      );
                    }
                  });
                } else {
                  let newQuantity = product.quantity + increment;

                  // validación stock
                  if (newQuantity > product.stockQuantity) {
                    newQuantity = product.stockQuantity;
                    Swal.fire({
                      icon: 'info',
                      title: 'Stock máximo alcanzado',
                      text: `No puedes tener más de ${product.stockQuantity} unidades.`,
                    });
                  }

                  return {
                    ...product,
                    quantity: Math.max(0, newQuantity),
                  };
                }
              }

              return product;
            }),
          };
        }),

      clearCart: () =>
        set(() => ({
          products: [],
        })),
      clearProduct: (id) =>
        set((state) => {
          return {
            products: state.products.map((product) => {
              if (product.id === id) {
                Swal.fire({
                  title: '¿Estás seguro?',
                  text: 'Estás a punto de eliminar el producto del carrito.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, eliminar',
                  cancelButtonText: 'Cancelar',
                }).then((result) => {
                  if (result.isConfirmed) {
                    set((state) => ({
                      products: state.products.filter((p) => p.id !== id),
                    }));
                    Swal.fire(
                      'Eliminado',
                      'El producto ha sido eliminado.',
                      'success',
                    );
                  }
                });
              }

              return product;
            }),
          };
        }),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    },
  ),
);

export const useTotalPrice = () =>
  useCartStore((state) =>
    state.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    ),
  );
