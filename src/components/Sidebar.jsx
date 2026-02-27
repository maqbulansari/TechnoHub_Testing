import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

const Sidebar = ({ isSidebarOpen }) => {
    const { hasRole, hasSubrole } = useContext(AuthContext);

    if (!isSidebarOpen) return null;

    return (
      <div className="p-4">
        <ul className="space-y-2">
          {hasRole && hasRole("ADMIN") && (
            <li>
              <Link to="/ManageRoles" className="text-sm font-medium hover:underline">
                Manage Roles
              </Link>
            </li>
          )}

          {/* Show resources to all users except Sponsor or Recruiter subroles */}
          {hasSubrole && !hasSubrole("SPONSOR") && !hasSubrole("RECRUITER") && (
            <li>
              <Link to="/AllResources" className="text-sm font-medium hover:underline">
                Resources
              </Link>
            </li>
          )}
        </ul>
      </div>
    );
};

export default Sidebar;
