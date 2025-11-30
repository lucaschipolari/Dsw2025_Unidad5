import React from "react";
import { Minus, Plus } from "lucide-react";
import Button from "../../shared/components/Button";
const CardProduct = ({ product }) => {
  return (
    <div className="border p-5 rounded-2xl">
      <div className="h-96 w-auto flex justify-center items-center">
        <img
          src="/noimg.png"
          className="h-full object-contain"
          alt="Sin imagen"
        />
      </div>

      <div className="">{product.name}</div>
      <div className="flex flex-row justify-between items-center">
        <div className="">
          <div>${product.currentUnitPrice}</div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <Minus />
            <input type="number" className="h-10 w-10" />
            <Plus />
          </div>
          <Button>Agregar</Button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
