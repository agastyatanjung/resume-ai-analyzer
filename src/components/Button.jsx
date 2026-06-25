import { Link } from "react-router-dom";
import { MdOutlineNavigateNext } from "react-icons/md";

const Button = () => {
  return (
    <Link
      to="/dashboard"
      className="group inline-flex items-center justify-between bg-black text-white font-medium px-6 py-3 rounded-full shadow-lg shadow-black/20 hover:bg-neutral-950 hover:-translate-y-0.5 transition-all duration-300 pointer-events-auto"
    >
      <span className="tracking-wide">Get Started</span>
      <MdOutlineNavigateNext className="bg-white text-black text-2xl rounded-full p-0.5 ml-4 shadow-sm group-hover:translate-x-1 transition-transform duration-300" />
    </Link>
  );
};

export default Button;
