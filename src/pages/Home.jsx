import bgMain from "../assets/bg-main.svg";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    // CONTAINER UTAMA: Menggunakan bg gelap agar gradien lingkaran menyala kontras
    <div
      style={{ backgroundImage: `url(${bgMain})` }}
      className="relative min-h-screen text-white bg-cover bg-center overflow-hidden flex items-center justify-center"
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6  flex flex-col items-center text-center">
        {/* Badge Kecil Estetik */}

        {/* HEADLINE: Menggunakan font-black tebal dengan gradien text pada kata kunci */}
        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight leading-[1.15] max-w-3xl">
          Kembangkan Resumemu ke Level Maksimal
          <span className="bg-clip-text ml-4 text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Bersama AI.
          </span>
        </h1>

        {/* SUB-HEADLINE: Menggunakan warna slate abu-abu agar nyaman dibaca */}
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mt-6 leading-relaxed">
          Bukan sekadar koreksi teks. AI kami membedah, mengevaluasi, dan
          memberikan rekomendasi cerdas untuk menyempurnakan setiap bagian dari
          CV Anda agar siap memikat hati para HRD.
        </p>

        {/* TOMBOL "COBA SEKARANG" (GROUP HOVER INTERAKTIF) */}
        <div className="mt-12">
          <Button />
        </div>
      </div>
    </div>
  );
};

export default Home;
