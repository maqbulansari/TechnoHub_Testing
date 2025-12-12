import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

export default function Header() {
  const { userLoggedIN } = useContext(AuthContext);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide">
          TechnoHub
        </Link>

        {/* Centered nav (desktop only) */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <li><a href="#trainers" className="hover:text-blue-600">Trainers</a></li>
          <li><a href="#tech" className="hover:text-blue-600">Technologies</a></li>
          <li><a href="#gallery" className="hover:text-blue-600">Gallery</a></li>
          <li><a href="#reads" className="hover:text-blue-600">Thursday Reads</a></li>
        </ul>

        {/* Right */}
        <div>
          {!userLoggedIN ? (
            <Link to="/login-3" className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow hover:bg-blue-700 transition">
              Join Now
            </Link>
          ) : (
            <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow hover:bg-blue-700 transition">
              Dashboard
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}