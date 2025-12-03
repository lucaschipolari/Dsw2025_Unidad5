import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, singout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="logo" className="w-8 h-8" />
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1 rounded-md text-sm text-center md:text-base ${
                isActive ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-200'
              }`
            }
          >
            Productos
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `px-3 py-1 rounded-md text-sm text-center md:text-base ${
                isActive ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-200'
              }`
            }
          >
            Carrito de compras
          </NavLink>
        </div>
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 mx-2 min-w-[120px] sm:min-w-[150px] md:w-72">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none flex-grow text-sm min-w-0"
          />
          <Search size={18} className="flex-shrink-0" />
        </div>
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">¡Hola, {user?.username}!</span>
              <button
                onClick={singout}
                className="px-3 py-1 rounded-md bg-red-200 hover:bg-red-300 text-sm text-center md:text-base"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm text-center md:text-base ${
                    isActive ? 'bg-purple-300' : 'bg-purple-200 hover:bg-purple-300'
                  }`
                }
              >
                Iniciar Sesión
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm text-center md:text-base ${
                    isActive ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                  }`
                }
              >
                Registrarse
              </NavLink>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-2 pb-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm text-center md:text-base ${
                isActive ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-200'
              }`
            }
          >
            Productos
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm text-center md:text-base ${
                isActive ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-200'
              }`
            }
          >
            Carrito de compras
          </NavLink>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-center md:text-base">{user?.name}</span>
              <button
                onClick={singout}
                className="px-3 py-1 rounded-md bg-red-200 text-sm hover:bg-red-300"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm text-center md:text-base ${
                    isActive ? 'bg-purple-300' : 'bg-purple-200 hover:bg-purple-300'
                  }`
                }
              >
                Iniciar Sesión
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm text-center md:text-base ${
                    isActive ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
                  }`
                }
              >
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
