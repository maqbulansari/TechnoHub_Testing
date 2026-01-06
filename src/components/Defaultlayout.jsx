import React, { useContext, useState, useEffect, useCallback } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userSubrole = localStorage.getItem("subrole");
    setRole(userRole || "");
    setSubrole(userSubrole || "");
  }, [userLoggedIN]);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setVisible(false);
    }
  }, [navigate, isMobile]);

  const menuItems = {
    STUDENT: {
      title: "Student Dashboard",
      items: [
        { path: "/Students_profile", label: "Profile" },
        { path: "/Students_batches", label: "Batch" },
        { path: "/Admission_table", label: "Interview" },
        { path: "/StudentAssignment", label: "Assignment" },
      ],  
      icon: faSchool,
      key: "student-dashboard",
    },
    TRAINER: [
      {
        title: "Trainer Dashboard",
        items: [
          { path: "/Trainer_profile", label: "Profile" },
          { path: "/Trainer_batch", label: "Batch" },
        ],
        icon: faChalkboardUser,
        key: "trainer-dashboard",
      },
      {
        title: "Admission Process",
        items: [{ path: "/Admission_table", label: "Interview" }],
        icon: faTicket,
        key: "admission-process",
      },
      {
        title: "Assessment Process",
        items: [{ path: "/AssessmentTable", label: "Assessment Candidate" }],
        icon: faCubes,
        key: "trainer-assessment-process",
      },
    ],
    RECRUITER: {
      title: "Recruitment",
      items:
        role === "ADMIN"
          ? [{ path: "/RecuriterTable", label: "Recruiter" }]
          : [
              { path: "/Recruitment_Profile", label: "Profile" },
              { path: "/ReadyToRecruitDashboard", label: "Dashboard" },
            ],
      icon: faChalkboardUser,
      key: "recruiter-dashboard",
    },
    SPONSOR: {
      title: "Sponsor",
      items:
        role === "ADMIN"
          ? [{ path: "/Sponsor_Table", label: "Sponsors" },{ path: "/Sponsored_Students", label: "Sponsored Students" }]
          : [
              { path: "/Sponsor_Profile", label: "Profile" },
              { path: "/Students_SponserDashboard", label: "Dashboard" },
            ],
      icon: faCubes,
      key: "sponsor-dashboard",
    },
    ADMIN: {
      title: "Assessment Process",
      items: [{ path: "/AssessmentTable", label: "Assessment Candidate" }],
      icon: faCubes,
      key: "admin-assessment-process",
    },
    ALLTRAINER: [
      {
        title: "Trainer Dashboard",
        items: [
          { path: "/AllTrainer", label: "Trainers" },
          { path: "/AssignBatchForTrainer", label: "Assign Trainer Batch" },
        ],
        icon: faChalkboardUser,
        key: "AllTrainer-dashboard",
      },
      {
        title: "Admission Process",

        items:
        role === "ADMIN"
          ? [{ path: "/Admission_table", label: "Interview" },{ path: "/AssignTrainerForInterview", label: "Assign Trainer Interview" },{ path: "/SelectedTrainerForInterview", label: "Selected Trainer" }]
          : [
             { path: "/Admission_table", label: "Interview" },
            ],
        icon: faTicket,
        key: "alltrainer-admission-process",
      },
      {
        title: "Assessment Process",
        items:
          role === "ADMIN"
          ?  [{ path: "/AssessmentSelectedStudent", label: "Assessment Candidate" }] :[{ path: "/AssessmentTable", label: "Assessment Candidate" }] ,
        icon: faCubes,
        key: "alltrainer-assessment-process",
      },
      {
        title: "Batches Management",
        items:
          role === "ADMIN"
          &&  [{ path: "/CreateBatches", label: "Create Batch" },{ path: "/AllBatches", label: "All Batchs" }] ,
        icon: faCubes,
        key: "alltrainer-batches-management",
      },
    ],
    ALLSTUDENT: {
      title: "Student Dashboard",
      items: [{ path: "/AllStudent", label: "Students" }],
      icon: faSchool,
      key: "All-student-dashboard",
    },
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setVisible(false);
    setRole("");
    setSubrole("");
    LogoutUser();
    navigate("/");
  }, [LogoutUser, navigate]);

  const handleMenuItemClick = useCallback(() => {
    setVisible(false);
  }, []);
  

  // MenuSection Component (replaces Dropdown)
  const MenuSection = ({ title, items, icon }) => {    
    return (
      <div className="menu-section">
        <div className="menu-heading">
          <div className="px-2">
            <FontAwesomeIcon icon={icon} />
          </div>
          <span className="menu-title capitalize">{title}</span>
        </div>
        <div className="pl-3">
          {items.map((item, index) => (                 
            <Link
              key={index}
              to={item.path}
              className="menu-item capitalize"
              onClick={handleMenuItemClick}
            >
              <FontAwesomeIcon icon={faChevronRight} className="menu-item-arrow" />
              <span className="capitalize">{item.label}</span>
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

  // Get sidebar position based on screen size
  const getSidebarPosition = () => {
    return isMobile ? "left" : "left";
  };

  return (
    <>
      {isOnline ? (
        <>
          <Sidebar
            className="posRel sidebarBg"
            visible={visible}
            onHide={() => setVisible(false)}
            position={getSidebarPosition()}
            blockScroll={isMobile}
            showCloseIcon={true}
            dismissable={true}
            closeOnEscape={true}
            header={
              <div className="d-flex align-items-center">
                <span className="text_avatar_48 text-nowrap">
                  {userLoggedIN && user && user.first_name.charAt(0)}
                </span>
                <div className="sidebarHeaderContainer">
                  <span className="sidebarRole text-black">WELCOME</span>
                  <span className="sidebarName capitalize text-black">
                    {userLoggedIN &&
                      user &&
                      `${user.first_name} ${user.last_name}`}
                  </span>
                </div>
              </div>
            }
          >
            <div className="sidebar-content-wrapper bg-white" style={{ 
              paddingBottom: '60px',
              // overflowX: 'auto',
              // height: '100%',
            }}>
              {renderMenuItems()}

              {role === "ADMIN" && (
                <Link 
                  to={routes.register3} 
                  className="dropdownBtn ml-2 "
                  onClick={handleMenuItemClick}
                >
                  <i className="pi pi-plus me-2  text-black font-bold"></i>
                  <span className="menu-title capitalize  text-blue-500">Create Enabler</span>
                </Link>
              )}
            </div>

              <div className="bg-white">
            <div className="authFuncCont">
              {userLoggedIN && (
                <>
                  <div className="me-2">
                    <i
                      className="pi pi-sign-out ml-3 "
                      style={{ fontSize: "1.5rem", color: "#dc3545", cursor: 'pointer' }}
                      onClick={() => setVisible(false)}
                      data-bs-target="#logoutModal"
                       data-bs-toggle="modal"
                    ></i>
                  </div>
                  <div className="d-flex flex-column">
                    <span
                      className="menu-title capitalize text-red-500"
                      style={{ cursor: 'pointer' }}
                      data-bs-toggle="modal"
                      data-bs-target="#logoutModal"
                      onClick={() => setVisible(false)}
                    >
                      Logout
                    </span>
                    <span
                      className="menu-title capitalize text-blue-500"
                      style={{ cursor: 'pointer' }}
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
            </div>
          </Sidebar>

          <div className="row mx-0">
            <div className="col-12 sticky-header-top pt-0 px-0">
              <Header setVisible={setVisible} toggleSidebar={toggleSidebar} />
            </div>
            <div className="col-12 p-0 px-0">
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
                  <h3 className="text-center mb-4 mt-2">
                    Are you sure you want to logout?
                  </h3>
                
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