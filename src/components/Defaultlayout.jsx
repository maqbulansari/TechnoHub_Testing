import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faChalkboardUser,
  faTicket,
  faCubes,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "primereact/sidebar";
import { all_routes } from "../feature-module/router/all_routes";
import { AuthContext } from "../contexts/authContext";
import { useNetworkCheck } from "../contexts/NetworkContext";
import { Offline } from "./Offline/Offline";

const Defaultlayout = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, userLoggedIN, LogoutUser } = useContext(AuthContext);
  const { isOnline } = useNetworkCheck();
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState("");
  const [subrole, setSubrole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userSubrole = localStorage.getItem("subrole");
    setRole(userRole || "");
    setSubrole(userSubrole || "");
  }, [userLoggedIN]);

  const menuItems = {
    STUDENT: {
      title: "Student Dashboard",
      items: [
        { path: "/Students_profile", label: "PROFILE" },
        { path: "/Students_batches", label: "BATCH" },
      ],
      icon: faSchool,
      key: "student-dashboard",
    },
    TRAINER: [
      {
        title: "Trainer Dashboard",
        items: [
          { path: "/Trainer_profile", label: "PROFILE" },
          { path: "/Trainer_batch", label: "BATCH" },
        ],
        icon: faChalkboardUser,
        key: "trainer-dashboard",
      },
      {
        title: "Admission Process",
        items: [{ path: "/Admission_table", label: "INTERVIEW" }],
        icon: faTicket,
        key: "admission-process",
      },
      {
        title: "Assessment Process",
        items: [{ path: "/AssessmentTable", label: "ASSESSMENT CANDIDATE" }],
        icon: faCubes,
        key: "assessment-process",
      },
    ],
    RECRUITER: {
      title: "Recruitment",
      items:
        role === "ADMIN"
          ? [{ path: "/RecuriterTable", label: "RECRUITER" }]
          : [
              { path: "/Recruitment_Profile", label: "PROFILE" },
              { path: "/ReadyToRecruitDashboard", label: "DASHBOARD" },
            ],
      icon: faChalkboardUser,
      key: "recruiter-dashboard",
    },
    SPONSOR: {
      title: "Sponsor",
      items:
        role === "ADMIN"
          ? [{ path: "/Sponsor_Table", label: "SPONSORS" }]
          : [
              { path: "/Sponsor_Profile", label: "PROFILE" },
              { path: "/Students_SponserDashboard", label: "DASHBOARD" },
            ],
      icon: faCubes,
      key: "sponsor-dashboard",
    },
    ADMIN: {
      title: "Assessment Process",
      items: [{ path: "/AssessmentTable", label: "ASSESSMENT CANDIDATE" }],
      icon: faCubes,
      key: "admin-assessment-process",
    },
    ALLTRAINER: [
      {
        title: "Trainer Dashboard",
        items: [
          { path: "/AllTrainer", label: "TRAINERS" },
          { path: "/AssignBatchForTrainer", label: "ASSIGN TRAINER BATCH" },
        ],
        icon: faChalkboardUser,
        key: "AllTrainer-dashboard",
      },
      {
        title: "Admission Process",
        items: [{ path: "/Admission_table", label: "INTERVIEW" }],
        icon: faTicket,
        key: "admission-process",
      },
      {
        title: "Assessment Process",
        items: [{ path: "/AssessmentTable", label: "ASSESSMENT CANDIDATE" }],
        icon: faCubes,
        key: "assessment-process",
      },
    ],
    ALLSTUDENT: {
      title: "Student Dashboard",
      items: [{ path: "/AllStudent", label: "STUDENTS" }],
      icon: faSchool,
      key: "All-student-dashboard",
    },
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setVisible(false);
    setRole("");
    setSubrole("");
    LogoutUser();
    navigate("/login-3");
  };

  // MenuSection Component (replaces Dropdown)
  const MenuSection = ({ title, items, icon }) => {
    return (
      <div className="menu-section">
        <div className="menu-heading">
          <div className="menu-heading-icon">
            <FontAwesomeIcon icon={icon} />
          </div>
          <span className="menu-title">{title}</span>
        </div>
        <div className="menu-items">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="menu-item"
              onClick={() => setVisible(false)}
            >
              <FontAwesomeIcon icon={faChevronRight} className="menu-item-arrow" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderMenuItems = () => {
    if (!subrole) return null;

    // If role is ADMIN, show all dropdowns
    if (role === "ADMIN") {
      return (
        <>
          {/* Student Section */}
          <MenuSection
            key={menuItems.ALLSTUDENT.key}
            title={menuItems.ALLSTUDENT.title}
            items={menuItems.ALLSTUDENT.items}
            icon={menuItems.ALLSTUDENT.icon}
          />

          {/* Trainer Sections */}
          {menuItems.ALLTRAINER.map((item) => (
            <MenuSection
              key={item.key}
              title={item.title}
              items={item.items}
              icon={item.icon}
            />
          ))}

          <MenuSection
            key={menuItems.RECRUITER.key}
            title={menuItems.RECRUITER.title}
            items={menuItems.RECRUITER.items}
            icon={menuItems.RECRUITER.icon}
          />

          <MenuSection
            key={menuItems.SPONSOR.key}
            title={menuItems.SPONSOR.title}
            items={menuItems.SPONSOR.items}
            icon={menuItems.SPONSOR.icon}
          />
        </>
      );
    }

    // For non-ADMIN roles, show only their specific section
    switch (subrole) {
      case "STUDENT":
        return (
          <MenuSection
            key={menuItems.STUDENT.key}
            title={menuItems.STUDENT.title}
            items={menuItems.STUDENT.items}
            icon={menuItems.STUDENT.icon}
          />
        );
      case "TRAINER":
        return menuItems.TRAINER.map((item) => (
          <MenuSection
            key={item.key}
            title={item.title}
            items={item.items}
            icon={item.icon}
          />
        ));
      case "RECRUITER":
        return (
          <MenuSection
            key={menuItems.RECRUITER.key}
            title={menuItems.RECRUITER.title}
            items={menuItems.RECRUITER.items}
            icon={menuItems.RECRUITER.icon}
          />
        );
      case "SPONSOR":
        return (
          <MenuSection
            key={menuItems.SPONSOR.key}
            title={menuItems.SPONSOR.title}
            items={menuItems.SPONSOR.items}
            icon={menuItems.SPONSOR.icon}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isOnline ? (
        <>
          <Sidebar
            className="posRel sidebarBg"
            visible={visible}
            onHide={() => setVisible(false)}
            header={
              <div>
                <span className="text_avatar_48 text-nowrap">
                  {userLoggedIN && user && user.first_name.charAt(0)}
                </span>
                <div className="sidebarHeaderContainer">
                  <span className="sidebarRole">WELCOME</span>
                  <span className="sidebarName"></span>
                  <span className="sidebarName uppercase">
                    {userLoggedIN &&
                      user &&
                      `${user.first_name} ${user.last_name}`}
                  </span>
                </div>
              </div>
            }
          >
            {renderMenuItems()}

            {role === "ADMIN" && (
              <Link to={routes.register3} className="dropdownBtn ml-3">
                <i className="pi pi-plus me-2"></i>
                <span className="menu-title text-blue-300">Create Enabler</span>
              </Link>
            )}

            <div className="authFuncCont">
              {userLoggedIN && (
                <>
                  <div className="me-2">
                    <i
                      className="pi pi-sign-out ml-3"
                      style={{ fontSize: "1.5rem", color: "#dc3545" }}
                    ></i>
                  </div>
                  <div className="d-flex flex-column">
                    <span
                      className="menu-title text-red-500"
                      data-bs-toggle="modal"
                      data-bs-target="#logoutModal"
                      onClick={() => setVisible(false)}
                    >
                      Logout
                    </span>
                    <span
                      className="menu-title text-blue-300"
                      onClick={() => {
                        setVisible(false);
                        navigate(`${routes.changePassword}`);
                      }}
                    >
                      Change Password
                    </span>
                  </div>
                </>
              )}
            </div>
          </Sidebar>

          <div className="row mx-0">
            <div className="col-xxl-12 col-xl-12 col-md-12 sticky-header-top px-0">
              <Header setVisible={setVisible} toggleSidebar={toggleSidebar} />
            </div>
            <div className="col-xxl-12 col-xl-12 col-md-12 px-0">
              <Outlet />
            </div>
          </div>

          {/* Logout Modal */}
          <div
            className="modal fade"
            id="logoutModal"
            aria-labelledby="logoutModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <h3 className="text-center">
                    Are you sure you want to logout?
                  </h3>
                  <hr />
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-md-6">
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                    </div>
                    <br />
                    <br />
                    <div className="col-xxl-6 col-xl-6 col-md-6">
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleLogout}
                        data-bs-dismiss="modal"
                      >
                        Logout <i className="fa-solid fa-right-from-bracket ml-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Offline />
      )}
    </>
  );
};

export default Defaultlayout;