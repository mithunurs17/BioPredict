// import DnaHeroBackground from "@/components/DnaHeroBackground";
import { useLocation } from "wouter";

export default function Landing() {
  const [, navigate] = useLocation();
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated DNA background image */}
      <div
        className="fixed inset-0 w-full h-full -z-10 animate-zoom-bg"
        style={{
          backgroundImage: 'url(/dna-bg-2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7) blur(1px)',
          transition: 'transform 10s linear',
        }}
      />
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in-up opacity-0 animate-delay-200">
          Welcome to <span className="text-fuchsia-400 animate-pulse">BioPredict</span>
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto animate-fade-in-up opacity-0 animate-delay-500">
          Predict health risks from biomarker analysis with advanced machine learning.
        </p>
        <button
          className="px-8 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-lg font-semibold shadow-lg transition transform hover:scale-105 active:scale-95 animate-fade-in-up opacity-0 animate-delay-700"
          onClick={() => navigate("/home")}
        >
          Enter Site
        </button>
      </div>
    </div>
  );
}