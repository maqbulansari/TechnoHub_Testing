import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faChalkboardUser,
  faTicket,
  faCubes,
  faUserShield, faClipboardCheck,
  faLayerGroup, faHandshake,faBook
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
  ADMIN_DASHBOARD: [
    {
      title: "Admin Dashboard",
      key: "admin-dashboard",
      icon: faUserShield, // or faGauge, faTachometerAlt
      items: [
        { path: "/Admin_Profile", label: "Profile" },
        { path: "/adminDashboard", label: "Dashboard" },
      ],
    },
  ],
  STUDENT: [
    {
      title: "Student Dashboard",
      key: "student-dashboard",
      icon: faSchool,
      items: [
        { path: "/Students_profile", label: "Profile" },
        { path: "/Students_batches", label: "Batch" },
        { path: "/Admission_table", label: "Interview" },
        { path: "/StuRecuitment", label: "Recuitment" },
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
          ? [{ path: "/RecuriterTable", label: "Recruiter" },{ path: "/RecruitmentAssignment", label: "Recruitment Status" }]
          : [
            { path: "/Recruitment_Profile", label: "Profile" },
            { path: "/ReadyToRecruitDashboard", label: "Dashboard" },
            { path: "/RecruiterHire", label: "Hire" },
          ],
    },
  ],
  SPONSOR: [
    {
      title: "Sponsor",
      key: "sponsor-dashboard",
      icon:  faHandshake,
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
        title: "Admin Tools",
        key: "admin-tools",
        icon: faUserShield,
        items: [
          { path: "/ManageRoles", label: "Manage Roles" },
        ],
      },
    ],
    COMMON: [
      {
        title: "Resources",
        key: "resources",
        icon: faBook,
        items: [{ path: "/AllResources", label: "Resources" }],
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
      icon: faClipboardCheck,
      items:
        role === "ADMIN"
          ? [{ path: "/AssessmentSelectedStudent", label: "Assessment Candidate" }]
          : [{ path: "/AssessmentTable", label: "Assessment Candidate" }],
    },
    {
      title: "Batches Management",
      key: "alltrainer-batches-management",
      icon: faLayerGroup,
      items:
        role === "ADMIN"
          ? [
            // { path: "/CreateBatches", label: "Create Batch" },
            { path: "/AllBatches", label: "All Batches" },
          ]
          : [],
    },
    // {
    //   title: "Bookhub Management",
    //   key: "alltrainer-bookhub-management",
    //   icon: faBook,
    //   items:
    //     role === "ADMIN"
    //       ? [
    //         { path: "/AdminAccessManager", label: "Access Management" },
    //         { path: "/bookhub/CreateBook", label: "CreateBook" },
    //       ]
    //       : [],
    // },
  ],
  ALLSTUDENT: [
    {
      title: "Student Dashboard",
      key: "allstudent-dashboard",
      icon: faSchool,
      items: [{ path: "/AllStudent", label: "Students" }],
    },
  ],
  BOOKHUB_MANAGER: [
    {
      title: "Bookhub Management",
      key: "bookhub-manager-management",
      icon: faBook,
      items: [
        { path: "/AdminAccessManager", label: "Access Management" },
        { path: "/bookhub/CreateBook", label: "Create Book" },
        { path: "/bookhub", label: "View Books" },
      ],
    },
  ],
  ADMISSION_MANAGER: [
    {
      title: "Admission Process",
      key: "admission-manager-process",
      icon: faTicket,
      items: [
        { path: "/Admission_table", label: "Interview" },
        { path: "/AssignTrainerForInterview", label: "Assign Trainer" },
        { path: "/SelectedTrainerForInterview", label: "Selected Trainer" },
      ],
    },
  ],
  CO_TRAINER: [
    {
      title: "Co-Trainer Dashboard",
      key: "co-trainer-dashboard",
      icon: faChalkboardUser,
      items: [
        { path: "/Trainer_profile", label: "Profile" },
        { path: "/Trainer_batch", label: "Batch" },
      ],
    },
    {
      title: "Assessment Process",
      key: "co-trainer-assessment-process",
      icon: faCubes,
      items: [{ path: "/AssessmentTable", label: "Assessment Candidate" }],
    },
  ],
});

const Defaultlayout = () => {
  const navigate = useNavigate();
  const { user, userLoggedIN, LogoutUser, API_BASE_URL, role: contextRole, responseSubrole, hasRole, hasSubrole } = useContext(AuthContext);
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

  // Compute role/subrole using AuthContext helpers; fall back to localStorage only when necessary
  useEffect(() => {
    if (hasRole && hasRole("ADMIN")) {
      setRole("ADMIN");
    } else if (contextRole) {
      setRole(contextRole);
    } else {
      const userRole = localStorage.getItem("role");
      setRole(userRole || "");
    }

    if (responseSubrole && responseSubrole.length > 0) {
      const raw = Array.isArray(responseSubrole) ? responseSubrole[0] : responseSubrole;
      const normalized = String(raw).toUpperCase().replace(/\s+/g, "_").trim();
      setSubrole(normalized);
    } else if (hasSubrole && hasSubrole("BOOKHUB_MANAGER")) {
      setSubrole("BOOKHUB_MANAGER");
    } else {
      const userSubrole = localStorage.getItem("subrole");
      // localStorage may contain comma-separated readable names; normalize first value
      if (userSubrole) {
        const first = userSubrole.split(",")[0];
        setSubrole(String(first).toUpperCase().replace(/\s+/g, "_").trim());
      } else {
        setSubrole("");
      }
    }
  }, [userLoggedIN, contextRole, responseSubrole, hasRole, hasSubrole]);

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
    // Admin access - only admin-specific menus
    if (hasRole && hasRole("ADMIN")) {
        const allMenus = menuItems("ADMIN");
        let menus = [
          ...allMenus.ADMIN_DASHBOARD,
          ...allMenus.ALLSTUDENT,
          ...allMenus.ALLTRAINER,
          ...allMenus.RECRUITER,
          ...allMenus.SPONSOR,
          ...allMenus.ADMIN,
        ];

        // Also include BookHub manager sections for ADMIN so real admins see BookHub admin items
        try {
          const bh = menuItems("BOOKHUB_MANAGER");
          const bhSections = bh.BOOKHUB_MANAGER || [];
          const existingKeys = new Set(menus.map((s) => s.key));
          menus = [...menus, ...bhSections.filter((s) => !existingKeys.has(s.key))];
        } catch (e) {
          // ignore
        }

        // Merge common sections for admin unless explicitly excluded
        try {
          const common = menuItems().COMMON || [];
          const existingKeys = new Set(menus.map((s) => s.key));
          menus = [...menus, ...common.filter((s) => !existingKeys.has(s.key))];
        } catch (e) {}

        return menus;
      }

      // If role is missing but we have a subrole (e.g., ADMIN user with subroles),
      // try to render subrole menus using the subrole as the key.
      if (!role && !subrole) return [];
      const key = role || subrole;
      const allMenus = menuItems(key);
      let menus = allMenus[subrole] || allMenus[role] || [];

      // Ensure Bookhub managers also get Bookhub admin items even if their primary
      // role is something else. Merge unique sections from the BOOKHUB_MANAGER key.
      try {
        if (hasSubrole && hasSubrole("BOOKHUB_MANAGER")) {
          const bh = menuItems("BOOKHUB_MANAGER");
          const bhSections = bh.BOOKHUB_MANAGER || [];
          // merge, avoiding duplicate keys
          const existingKeys = new Set(menus.map((s) => s.key));
          menus = [...menus, ...bhSections.filter((s) => !existingKeys.has(s.key))];
        }

        if (hasSubrole && hasSubrole("ADMISSION_MANAGER")) {
          const adm = menuItems("ADMISSION_MANAGER");
          const admSections = adm.ADMISSION_MANAGER || [];
          const existingKeys = new Set(menus.map((s) => s.key));
          menus = [...menus, ...admSections.filter((s) => !existingKeys.has(s.key))];
        }
      } catch (e) {
        // ignore merge errors and fall back to computed menus
      }

      // Merge common sections for non-excluded subroles (not Sponsor/Recruiter)
      try {
        const isExcluded = hasSubrole && (hasSubrole("SPONSOR") || hasSubrole("RECRUITER"));
        if (!isExcluded) {
          const common = menuItems().COMMON || [];
          const existingKeys = new Set(menus.map((s) => s.key));
          menus = [...menus, ...common.filter((s) => !existingKeys.has(s.key))];
        }
      } catch (e) {}

      return menus;
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
                      <div className="w-11 h-11 min-w-[2.75rem] min-h-[2.75rem] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
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

                {hasRole && hasRole("ADMIN") && (
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
