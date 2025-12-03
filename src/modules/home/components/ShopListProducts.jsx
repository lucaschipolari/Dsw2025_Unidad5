import React, { useEffect, useState } from 'react';
import { getPublicProducts } from '../../products/services/list';
import Button from '../../shared/components/Button';
import CardProduct from './CardProduct';

const ShopListProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getPublicProducts(
        searchTerm,
        status,
        pageNumber,
        pageSize,
      );

      setProducts(data.productItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    await fetchProducts();
  };

  return (
    <div className="mx-10 my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          <span>Buscando datos...</span>
        ) : (
          products.map((product) => (
            <CardProduct key={product.sku} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ShopListProducts;
