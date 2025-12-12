import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-700 font-semibold">TechnoHub</div>
        <div className="text-sm text-gray-500">© {new Date().getFullYear()} TechnoHub — All rights reserved</div>
        <div className="flex gap-3 text-gray-200 text-sm">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
};