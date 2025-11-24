import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../feature-module/router/all_routes";
import { Button } from "primereact/button";
import { AuthContext } from "../contexts/authContext";
const Header = ({ setVisible }) => {
    const routes = all_routes;
    const storedRole = localStorage.getItem("role");
    const { userLoggedIN, accessToken, refreshToken, userID } = useContext(AuthContext);
    return (<nav className="navbar flex justify-between items-center px-4 py-2 shadow-md bg-white">
      <div className="flex items-center gap-3">

        {userLoggedIN && accessToken && refreshToken && userID && (<Button icon="pi pi-bars" className="bg-transparent border-none text-blue-600" onClick={() => setVisible(true)} aria-label="Open sidebar"/>)}

        {/* Logo */}
        <div className="navbar-logo">
          <div className="navbar-logo">
        <Link to="/">
          <h1 className="logoHeading">LGSTechnoHub</h1>
        </Link>
      </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!userLoggedIN && !accessToken && !refreshToken && (<>
            <Link to={routes.login3} className="btn btn-light">
              Login
            </Link>

            {storedRole !== "ADMIN" && (<Link to={routes.register} className="btn btn-primary">
                Register
              </Link>)}
          </>)}
      </div>
    </nav>);
};
export default Header;