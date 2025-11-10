import { useState, useEffect, useRef } from "react";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Works for both desktop and mobile
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-1 bg-white text-black font-semibold rounded-lg transition w-32"
      >
        Serch
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            <li onClick={()=> setIsOpen(false)}>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">
                Achar
              </button>
            </li>
            <li onClick={()=> setIsOpen(false)}>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">
                Papad
              </button>
            </li>
            <li onClick={()=> setIsOpen(false)}>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100">
                Nobel 3D fryms
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
