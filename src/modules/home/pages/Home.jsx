import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getProducts } from '../../products/services/list';
import { getOrders } from '../../orders/services/listServices';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(productStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(
        searchTerm,
        status,
        pageNumber,
        pageSize,
      );

      if (error) throw error;

      setTotalProducts(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders(
        searchTerm,
        status,
        pageNumber,
        pageSize,
      );

      if (error) throw error;

      setTotalOrders(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
      <Card>
        <h3>Productos</h3>
        <p>Cantidad: {totalProducts}</p>
      </Card>

      <Card>
        <h3>Ordenes</h3>
        <p>Cantidad: {totalOrders}</p>
      </Card>
    </div>
  );
}

export default Home;
