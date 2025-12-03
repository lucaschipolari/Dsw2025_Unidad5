import RegisterForm from '../components/RegisterForm';

function ModalRegister({ show, onClose, onSwitch }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl relative p-5 w-[90%] sm:w-[400px]">
        <button
          onClick={onClose}
          className="absolute right-3 top-1 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="p-5 sm:p-3">
          <RegisterForm insideModal />
        </div>
        <button
          onClick={onSwitch}
          className="mt-4 block mx-auto text-sm text-gray-700 hover:text-gray-900 transition"
          type="button"
        >
          ¿Ya tenés cuenta? Iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default ModalRegister;
