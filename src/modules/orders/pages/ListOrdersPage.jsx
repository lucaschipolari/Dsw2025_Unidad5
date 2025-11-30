import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../shared/components/Card";
import Button from "../../shared/components/Button";
import { getProducts } from "../../products/services/list";
import { getOrders } from "../services/listServices";

const orderStatus = {
  ALL: "all",
  PENDING: "pending",
  PROCESSING: "inprocess",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELED: "cancelled",
};

function ListOrderPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders(
        searchTerm,
        status,
        pageNumber,
        pageSize
      );

      if (error) throw error;

      setTotal(data.total);
      setOrders(data.orderItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    await fetchOrders();
  };

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Ordenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <input
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              type="text"
              placeholder="Buscar"
              className="text-[1.3rem] w-full"
            />
            <Button className="h-11 w-11" onClick={handleSearch}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </Button>
          </div>
          <select
            onChange={(evt) => setStatus(evt.target.value)}
            className="text-[1.3rem]"
          >
            <option value={orderStatus.ALL}>Todos</option>
            <option value={orderStatus.PENDING}>Pendientes</option>
            <option value={orderStatus.PROCESSING}>En proceso</option>
            <option value={orderStatus.SHIPPED}>Enviados</option>
            <option value={orderStatus.DELIVERED}>Entregados</option>
            <option value={orderStatus.CANCELED}>Cancelados</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <span>Buscando datos...</span>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No hay órdenes para mostrar
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.orderId}>
              <div className="flex justify-between items-center">
                <div className="p-2 w-2xl">
                  <span
                    className={`px-3 py-1 my-2.5 rounded text-white ${
                      order.orderStatus === "PENDING"
                        ? "bg-yellow-500"
                        : order.orderStatus === "PROCESSING"
                        ? "bg-blue-500"
                        : order.orderStatus === "CANCELED"
                        ? "bg-red-600"
                        : order.orderStatus === "DELIVERED"
                        ? "bg-green-600"
                        : order.orderStatus === "SHIPPED"
                        ? "bg-purple-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      Orden #{order.orderId?.substring(0, 8)}
                    </h2>
                  </div>

                  <p className="mt-2 text-base">
                    <strong>Cliente:</strong> {order.nameCustomer}
                  </p>
                </div>

                {/* <p className="text-base">
                <strong>Envío:</strong> {order.shippingAddress}
              </p>

              <p className="text-base">
                <strong>Facturación:</strong> {order.billingAddress}
              </p> */}

                {/* <div className="mt-3">
                <strong>Items:</strong>
                <ul className="list-disc ml-6">
                  {order.orderItems?.map((item) => (
                    <li key={item.productId}>
                      {item.name} — {item.quantity} x ${item.unitPrice}
                    </li>
                  ))}
                </ul>
              </div> */}
                <Button className="h-11 w-25 mt-1 text-sm lg:text-lg">
                  Ver
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-center items-center mt-3">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="bg-gray-200 disabled:bg-gray-100"
        >
          Atras
        </button>
        <span>
          {pageNumber} / {totalPages}
        </span>
        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="bg-gray-200 disabled:bg-gray-100"
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className="ml-3"
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListOrderPage;
