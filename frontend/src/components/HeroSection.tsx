import Image from 'next/image';

type Props = {
  onLogin: () => void;
};

export default function HeroSection({ onLogin }: Props) {
  return (
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-full px-6 py-12 space-y-12 md:space-y-0">
      <div className="w-full md:w-1/2 lg:w-[55%] flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 leading-tight">
          Welcome to <span className="text-cyan-900">Incident Logger</span>
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-700">
          Seamlessly log, manage, and summarize incidents with AI-assisted support.
        </p>
        <button
          onClick={onLogin}
          className="bg-cyan-900 hover:bg-cyan-950 active:bg-black text-white text-2xl px-10 py-5 rounded-xl transition-all shadow-md"
        >
          Sign in with Google
        </button>
      </div>

      <div className="w-full md:w-1/2 lg:w-[40%] flex justify-center items-center">
        <div className="relative w-full max-w-[500px] h-auto">
          <Image
            src="/hero.png"
            alt="Hero"
            width={500}
            height={500}
            className="w-full h-auto object-contain rounded-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
