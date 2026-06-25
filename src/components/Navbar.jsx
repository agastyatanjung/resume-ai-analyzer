import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import Button from "./Button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all p-4 duration-500${isScrolled ? "bg-purple-100/10 backdrop-blur-md border border-purple-100/20  p-4 shadow-xl shadow-black/10 " : "bg-transparent border-transparent"}`}
    >
      <div className="flex items-center justify-between px-20">
        {/* logo */}
        <Link to="/" className="text-purple-600 text-2xl font-bold">
          Resumind.id
        </Link>

        <Link
          to="/dashboard"
          className="group inline-flex items-center justify-between bg-black text-white font-medium px-6 py-3 rounded-full shadow-lg shadow-black/20 hover:bg-neutral-950 hover:-translate-y-0.5 transition-all duration-300 pointer-events-auto"
        >
          <span className="tracking-wide">Get Started</span>
          <MdOutlineNavigateNext className="bg-white text-black text-2xl rounded-full p-0.5 ml-4 shadow-sm group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
