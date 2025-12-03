import LoginForm from '../components/LoginForm';

function ModalLogin({ show, onClose, onSwitch }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl relative p-5 w-[90%] sm:w-[400px]">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <LoginForm insideModal />

        <button
          className="mt-4 text-sm underline text-blue-600"
          onClick={onSwitch}
        >
          ¿No tenés cuenta? Registrate
        </button>

      </div>
    </div>
  );
}

export default ModalLogin;
