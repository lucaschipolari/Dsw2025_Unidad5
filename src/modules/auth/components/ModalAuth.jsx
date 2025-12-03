function ModalAuth({ showModal, setShowModal, mode = 'register', onClose }) {
  if (!showModal) return null;

  const close = () => {
    setShowModal(false);
    onClose && onClose();
  };

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          relative
          animate-fadeIn
        "
      >
        <button
          onClick={close}
          className="
            absolute top-3 right-3
            text-gray-400 hover:text-gray-600
          "
        >
          ✕
        </button>

        {mode === 'register'
          ? <RegisterForm/>
          : <LoginForm  />}
      </div>
    </div>
  );
}
