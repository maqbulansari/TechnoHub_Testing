import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronRight } from "lucide-react";
import { sortAlphabetically } from "@/utils/validation";

/**
 * Reusable, responsive, theme-aware sidebar dropdown
 * - Alphabetically sorts items by label
 * - Responsive touch targets
 * - Smooth animated expand/collapse
 * - Uses project theme colors
 *
 * @param {string}   title       - Dropdown header text
 * @param {Array}    items       - Array of { path, label } objects
 * @param {object}   icon        - FontAwesome icon object
 * @param {function} onItemClick - Callback when an item is clicked
 * @param {boolean}  sortItems   - Whether to sort items alphabetically (default: true)
 * @param {string}   className   - Additional className for the wrapper
 */
const Dropdown = ({
  title,
  items,
  icon,
  onItemClick,
  sortItems = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [items, isOpen]);

  // Sort items alphabetically if enabled
  const displayItems = sortItems ? sortAlphabetically(items, "label") : items;

  return (
    <div className={`my-1 ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`
          w-full flex items-center gap-2 px-3 py-2.5
          rounded-lg text-left
          transition-colors duration-200
          hover:bg-primary/5
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
          ${isOpen ? "bg-primary/5 text-primary" : "text-gray-700"}
        `}
        aria-expanded={isOpen}
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={`w-4 h-4 shrink-0 transition-colors duration-200 ${isOpen ? "text-primary" : "text-gray-500"
              }`}
          />
        )}
        <span className="flex-1 text-sm font-semibold truncate">{title}</span>
        <ChevronRight
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""
            }`}
        />
      </button>

      {/* Expandable menu list */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${height}px` : "0px" }}
      >
        <ul ref={contentRef} className="py-1 pl-6 pr-2 space-y-0.5">
          {displayItems.map((item, index) => (
            <li key={item.path || index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm transition-colors duration-150
                  ${isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
                onClick={() => {
                  setIsOpen(false);
                  if (onItemClick) onItemClick();
                }}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
