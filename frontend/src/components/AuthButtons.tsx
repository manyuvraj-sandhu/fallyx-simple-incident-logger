type Props = {
    onLogout: () => void;
  };
  
  export default function AuthButtons({ onLogout }: Props) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onLogout}
          className="bg-cyan-900 hover:bg-cyan-950 text-white text-sm px-4 py-2 rounded-md shadow-md transition-all"
        >
          Logout
        </button>
      </div>
    );
  }
  