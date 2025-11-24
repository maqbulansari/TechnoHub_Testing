import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { faSchool, faChalkboardUser, faTicket, faCubes, } from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "primereact/sidebar";
import Dropdown from "./Dropdown";
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
            items: role === "ADMIN"
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
            items: role === "ADMIN"
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
    const renderMenuItems = () => {
        if (!subrole)
            return null;
        // If role is ADMIN, show all dropdowns
        if (role === "ADMIN") {
            return (<>
          {/* Student Dropdown */}
          <Dropdown key={menuItems.ALLSTUDENT.key} title={menuItems.ALLSTUDENT.title} items={menuItems.ALLSTUDENT.items} icon={menuItems.ALLSTUDENT.icon} onItemClick={() => setVisible(false)}/>

          {/* Trainer Dropdown(s) */}
          {menuItems.ALLTRAINER.map((item) => (<Dropdown key={item.key} title={item.title} items={item.items} icon={item.icon} onItemClick={() => setVisible(false)}/>))}

          <Dropdown key={menuItems.RECRUITER.key} title={menuItems.RECRUITER.title} items={menuItems.RECRUITER.items} icon={menuItems.RECRUITER.icon} onItemClick={() => setVisible(false)}/>

          <Dropdown key={menuItems.SPONSOR.key} title={menuItems.SPONSOR.title} items={menuItems.SPONSOR.items} icon={menuItems.SPONSOR.icon} onItemClick={() => setVisible(false)}/>

        </>);
        }
        // For non-ADMIN roles, show only their specific dropdown
        switch (subrole) {
            case "STUDENT":
                return (<Dropdown key={menuItems.STUDENT.key} title={menuItems.STUDENT.title} items={menuItems.STUDENT.items} icon={menuItems.STUDENT.icon} onItemClick={() => setVisible(false)}/>);
            case "TRAINER":
                return menuItems.TRAINER.map((item) => (<Dropdown key={item.key} title={item.title} items={item.items} icon={item.icon} onItemClick={() => setVisible(false)}/>));
            case "RECRUITER":
                return (<Dropdown key={menuItems.RECRUITER.key} title={menuItems.RECRUITER.title} items={menuItems.RECRUITER.items} icon={menuItems.RECRUITER.icon} onItemClick={() => setVisible(false)}/>);
            case "SPONSOR":
                return (<Dropdown key={menuItems.SPONSOR.key} title={menuItems.SPONSOR.title} items={menuItems.SPONSOR.items} icon={menuItems.SPONSOR.icon} onItemClick={() => setVisible(false)}/>);
            default:
                return null;
        }
    };
    return (<>
      {isOnline ? (<>
          <Sidebar className="posRel sidebarBg" visible={visible} onHide={() => setVisible(false)} header={<div>
                <span className="text_avatar_48 text-nowrap">
                  {userLoggedIN && user && user.first_name.charAt(0)}
                </span>
                <div className="sidebarHeaderContainer">
                  <span className="sidebarRole">WELCOME</span>
                  <span className="sidebarName"></span>
                  <span className="sidebarName text-muted capitalize">
                    {userLoggedIN &&
                    user &&
                    `${user.first_name} ${user.last_name}`}
                  </span>
                </div>
              </div>}>
            {renderMenuItems()}

            <Sidebar className="posRel sidebarBg" visible={visible} onHide={() => setVisible(false)} header={<div>
                  <span className="text_avatar_48 text-nowrap">
                    {userLoggedIN && user && user.first_name.charAt(0)}
                  </span>
                  <div className="sidebarHeaderContainer">
                    <span className="sidebarRole">WELCOME</span>
                    <span className="sidebarName"></span>
                    <span className="sidebarName capitalize">
                      {userLoggedIN &&
                    user &&
                    `${user.first_name} ${user.last_name}`}
                    </span>
                  </div>
                </div>}>
              {renderMenuItems()}

              {role === "ADMIN" && (<Link to={routes.register3} className="dropdownBtn" onClick={() => setVisible(false)}>
                  <i className="pi pi-plus me-2"></i>
                  Create Enabler
                </Link>)}

              <div className="authFuncCont">
                {userLoggedIN && (<>
                    {/* Existing Logout Section */}
                    <div className="me-2">
                      <i className="pi pi-sign-out" style={{ fontSize: "2rem", color: "#dc3545" }}></i>
                    </div>

                    <div className="d-flex flex-column">
                      {/* <span className="text-muted">Ready to leave?</span> */}
                      <span className="btnLogout  text-red-500" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={() => setVisible(false)}>
                        Logout
                      </span>
                      <span className="btnChangePassword" onClick={() => {
                    setVisible(false);
                    navigate(`${routes.changePassword}`);
                }}>
                        Change Password
                      </span>
                    </div>
                  </>)}
              </div>
            </Sidebar>

            <div className="authFuncCont">
              {userLoggedIN && (<>
                  <div className="me-2">
                    <i className="pi pi-sign-out" style={{ fontSize: "2rem", color: "#dc3545" }}></i>
                  </div>
                  <div className="d-flex flex-column">
                    <span className="text-muted">Ready to leave?</span>
                    <span className="btnLogout" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={() => setVisible(false)}>
                      Logout
                    </span>
                  </div>
                </>)}
            </div>
          </Sidebar>

          <div className="row mx-0">
            <div className="col-xxl-12 col-xl-12 col-md-12 sticky-header-top px-0">
              <Header setVisible={setVisible} toggleSidebar={toggleSidebar}/>
            </div>
            <div className="col-xxl-12 col-xl-12 col-md-12 px-0">
              <Outlet />
            </div>
          </div>

          {/* Logout Modal */}
          <div className="modal fade" id="logoutModal" aria-labelledby="logoutModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <h3 className="text-center">
                    Are you sure you want to logout?
                  </h3>
                  <hr />
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-md-6">
                      <button type="button" className="btn btn-light w-100" data-bs-dismiss="modal">
                        Cancel
                      </button>
                    </div><br /><br />
                    <div className="col-xxl-6 col-xl-6 col-md-6">
                      <button type="button" className="btn btn-primary w-100" onClick={handleLogout} data-bs-dismiss="modal">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>) : (<Offline />)}
    </>);
};
export default Defaultlayout;
