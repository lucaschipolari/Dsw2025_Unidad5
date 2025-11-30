import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="logo" className="w-8 h-8" />
        </div>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#" className="px-3 py-1 rounded-md bg-gray-100">
            Productos
          </a>
          <a href="#" className="hover:text-gray-600">
            Carrito de compras
          </a>
        </div>

        {/* SEARCH DESKTOP */}
        <div className="hidden md:flex w-72 items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none flex-1 text-sm"
          />
          <Search size={18} />
        </div>

        {/* BOTONES DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 rounded-md bg-purple-200 text-sm">
            Iniciar Sesión
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-200 text-sm">
            Registrarse
          </button>
        </div>

        {/* HAMBURGER BUTTON (MOBILE) */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENÚ MOBILE */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-2 pb-4">
          <a href="#" className="px-3 py-2 rounded-md bg-gray-100">
            Productos
          </a>
          <a href="#" className="px-3 py-2 hover:bg-gray-50 rounded-md">
            Carrito de compras
          </a>

          {/* BUSCADOR */}
          <div className="flex w-full items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none flex-1 text-sm"
            />
            <Search size={18} />
          </div>

          {/* BOTONES */}
          <button className="px-4 py-2 rounded-md bg-purple-200 text-sm">
            Iniciar Sesión
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-200 text-sm">
            Registrarse
          </button>
        </div>
      )}
    </nav>
  );
}
