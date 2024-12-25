import React from "react";
import { NavLink } from "react-router-dom";
import { jhlogo } from "../assets/icons";

const Navbar = () => {
  return (
    <header className="header z-100">
      <NavLink
        to="/"
        className="w-12 h-12 bg-transparent flex items-center justify-center flex-bold shadow-md border-[1px] p-1 rounded-lg border-cyan-500"
      >
        <img src={jhlogo} />
      </NavLink>
      <nav className="flex text-lg gap-7 font-medium">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-green-500" : "text-slate-200"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "text-green-500" : "text-slate-200"
          }
        >
          Projects
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
