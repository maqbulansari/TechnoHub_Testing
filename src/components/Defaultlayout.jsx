import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faChalkboardUser,
  faTicket,
  faCubes,
} from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "primereact/sidebar";
import { all_routes } from "../feature-module/router/all_routes";
import { AuthContext } from "../contexts/authContext";
import { useNetworkCheck } from "../contexts/NetworkContext";
import { Offline } from "./Offline/Offline";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

// MENU CONFIGURATION FUNCTION
const menuItems = (role) => ({
  STUDENT: [
    {
      title: "Student Dashboard",
      key: "student-dashboard",
      icon: faSchool,
      items: [
        { path: "/Students_profile", label: "Profile" },
        { path: "/Students_batches", label: "Batch" },
        { path: "/Admission_table", label: "Interview" },
        // { path: "/StudentAssignment", label: "Assignment" },
      ],
    },
  ],
  TRAINER: [
    {
      title: "Trainer Dashboard",
      key: "trainer-dashboard",
      icon: faChalkboardUser,
      items: [
        { path: "/Trainer_profile", label: "Profile" },
        { path: "/Trainer_batch", label: "Batch" },
      ],
    },
    {
      title: "Admission Process",
      key: "admission-process",
      icon: faTicket,
      items: [{ path: "/Admission_table", label: "Interview" }],
    },
    {
      title: "Assessment Process",
      key: "trainer-assessment-process",
      icon: faCubes,
      items: [{ path: "/AssessmentTable", label: "Assessment Candidate" }],
    },
  ],
  RECRUITER: [
    {
      title: "Recruitment",
      key: "recruiter-dashboard",
      icon: faChalkboardUser,
      items:
        role === "ADMIN"
          ? [{ path: "/RecuriterTable", label: "Recruiter" }]
          : [
            { path: "/Recruitment_Profile", label: "Profile" },
            { path: "/ReadyToRecruitDashboard", label: "Dashboard" },
          ],
    },
  ],
  SPONSOR: [
    {
      title: "Sponsor",
      key: "sponsor-dashboard",
      icon: faCubes,
      items:
        role === "ADMIN"
          ? [
            { path: "/Sponsor_Table", label: "Sponsors" },
            { path: "/Sponsored_Students", label: "Sponsored Students" },
          ]
          : [
            { path: "/Sponsor_Profile", label: "Profile" },
            { path: "/Students_SponserDashboard", label: "Dashboard" },
          ],
    },
  ],
  ADMIN: [
    {
      title: "Assessment Process",
      key: "admin-assessment-process",
      icon: faCubes,
      items: [{ path: "/AssessmentTable", label: "Assessment Candidate" }],
    },
  ],
  ALLTRAINER: [
    {
      title: "Trainer Dashboard",
      key: "alltrainer-dashboard",
      icon: faChalkboardUser,
      items: [
        { path: "/AllTrainer", label: "Trainers" },
        // { path: "/AssignBatchForTrainer", label: "Assign Trainer Batch" },
      ],
    },
    {
      title: "Admission Process",
      key: "alltrainer-admission-process",
      icon: faTicket,
      items:
        role === "ADMIN"
          ? [
            { path: "/Admission_table", label: "Interview" },
            // { path: "/AssignTrainerForInterview", label: "Assign Trainer Interview" },
            { path: "/SelectedTrainerForInterview", label: "Selected Trainer" },
          ]
          : [{ path: "/Admission_table", label: "Interview" }],
    },
    {
      title: "Assessment Process",
      key: "alltrainer-assessment-process",
      icon: faCubes,
      items:
        role === "ADMIN"
          ? [{ path: "/AssessmentSelectedStudent", label: "Assessment Candidate" }]
          : [{ path: "/AssessmentTable", label: "Assessment Candidate" }],
    },
    {
      title: "Batches Management",
      key: "alltrainer-batches-management",
      icon: faCubes,
      items:
        role === "ADMIN"
          ? [
            // { path: "/CreateBatches", label: "Create Batch" },
            { path: "/AllBatches", label: "All Batches" },
          ]
          : [],
    },
  ],
  ALLSTUDENT: [
    {
      title: "Student Dashboard",
      key: "allstudent-dashboard",
      icon: faSchool,
      items: [{ path: "/AllStudent", label: "Students" }],
    },
  ],
});

const Defaultlayout = () => {
  const navigate = useNavigate();
  const { user, userLoggedIN, LogoutUser, API_BASE_URL } = useContext(AuthContext);
  const { isOnline } = useNetworkCheck();
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState("");
  const [subrole, setSubrole] = useState("");
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get role/subrole from localStorage
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userSubrole = localStorage.getItem("subrole");
    setRole(userRole || "");
    setSubrole(userSubrole || "");
  }, [userLoggedIN]);

  const toggleSidebar = useCallback(() => setVisible((prev) => !prev), []);
  const handleLogout = useCallback(() => {
    setVisible(false);
    setRole("");
    setSubrole("");
    LogoutUser();
    navigate("/");
  }, [LogoutUser, navigate]);
  const handleMenuItemClick = useCallback(() => setVisible(false), []);

  // Get menus for current role
  const getMenusForRole = () => {
    if (!role || !subrole) return [];
    const allMenus = menuItems(role);
    if (role === "ADMIN") {
      return [
        ...allMenus.ALLSTUDENT,
        ...allMenus.ALLTRAINER,
        ...allMenus.RECRUITER,
        ...allMenus.SPONSOR,
      ];
    }
    return allMenus[subrole] || [];
  };

  // MenuSection Component
  const MenuSection = ({ title, items, icon }) => (
    <div className="menu-section">
      <div className="menu-heading flex items-center px-2">
        {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
        <span className="menu-title text-gray-900 capitalize">{title}</span>
      </div>
      <div className="pl-2">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="menu-item text-gray-700 capitalize"
            onClick={handleMenuItemClick}
          >
            <span className="ml-2 text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  const renderMenuItems = () => getMenusForRole().map((section) => (
    <MenuSection
      key={section.key}
      title={section.title}
      items={section.items}
      icon={section.icon}
    />
  ));


  const profileImage = user?.user_profile
    ? user.user_profile.replace(/^http:\/\/localhost:8000/, API_BASE_URL)
    : null;



  return (
    <>
      {isOnline ? (
        <>
          <Sidebar
            className="posRel sidebarBg"
            visible={visible}
            onHide={() => setVisible(false)}
            position="left"
            blockScroll={isMobile}
            showCloseIcon
            dismissable
            closeOnEscape
            header={
              <div className="sidebar-user-header">
                <div className="user-row">
                  {/* Avatar */}
                  <div className="user-avatar-wrapper">
                    {userLoggedIN && profileImage ? (
                      // If user has a profile image, show it
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-11 h-11 rounded-lg object-cover"
                      />
                    ) : (
                      // If no profile image, use the styled fallback div
                      <div className="user-avatar">
                        {userLoggedIN && user
                          ? user.first_name?.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>




                  {/* Info */}
                  <div className="user-meta">
                    <span className="welcome-text">Welcome</span>

                    <span className="user-name">
                      {userLoggedIN && user
                        ? `${user.first_name} ${user.last_name}`
                        : "User"}
                    </span>

                    {subrole == "undefined" ? (
                      <span className="user-role">Admin</span>
                    ) : (<span className="user-role">{subrole}</span>)}
                  </div>
                </div>
              </div>
            }


          >
            <div className="sidebar-content-wrapper bg-white" style={{ paddingBottom: '60px' }}>
              {renderMenuItems()}

              {role === "ADMIN" && (
                <Link
                  to={all_routes.register3}
                  className="dropdownBtn ml-"
                  onClick={handleMenuItemClick}
                >
                  <i className="pi pi-plus me-2 text-gray-700 font-bold"></i>
                  <span className=" capitalize text-sm text-[#2196f3]">Create User</span>
                </Link>
              )}
            </div>

            <div className="bg-white">
              <div className="authFuncCont">
                {userLoggedIN && (
                  <div className="px-2" >
                    <div className="flex items-center justify-between gap-2">
                      {/* Logout */}
                      <button
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors"

                        onClick={() => { setVisible(false), setLogoutDialog(true) }}
                      >
                        <i className="pi pi-sign-out text-red-500" ></i>
                        <span className="text- font-medium text-red-600">Logout</span>
                      </button>
                      {/* Change Password */}
                      {/* <button
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg  transition-colors"
                        onClick={() => {
                          setVisible(false);
                          navigate(all_routes.changePassword);
                        }}
                      >
                        <i className="pi pi-lock text-[#2196f3]" style={{ fontSize: "0.9rem" }}></i>
                        <span className="text-xs font-medium text-nowrap text-[#2196f3]">Change Password</span>
                      </button> */}


                    </div>
                  </div>
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


          {/* Logout Dialog Modal */}
          <Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden [&>button]:hidden rounded-xl">

              {/* Header */}
              <DialogHeader className="px-5 pt-4 pb-4 space-y-1">
                <DialogTitle className="text-xl pb-2 font-semibold ">
                  Confirm Logout
                </DialogTitle>
                <DialogDescription className="text-sm pb-2 text-muted-foreground leading-relaxed">
                  Are you sure you want to logout?
                </DialogDescription>
              </DialogHeader>

              {/* Footer Buttons */}
              <DialogFooter className="px-5 pb-5 flex gap-3 justify-end bg-muted/10">
                <Button
                  variant="ghost"
                  className="flex-1 sm:flex-none border-1"
                  onClick={() => setLogoutDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant=""
                  className="flex-1 sm:flex-none"
                  onClick={() => {
                    setLogoutDialog(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </DialogFooter>

            </DialogContent>
          </Dialog>

        </>
      ) : (
        <Offline />
      )}
    </>
  );
};

export default Defaultlayout;
