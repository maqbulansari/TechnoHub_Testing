import React from "react";
const Sidebar = ({ isSidebarOpen }) => {
    const StudentsItems = [
        { path: "/Students_profile", label: "PROFILE" },
        { path: "/Students_batches", label: "BATCHES" },
    ];
    if (!isSidebarOpen)
        return null;
    return (<div>
      {/* <ul className="mt-4">
          <li className="mb-2">
            <Dropdown
              title="Student Dashboard"
              items={StudentsItems}
              icon={faSchool}
            />
          </li>
        </ul> */}
    </div>);
};
export default Sidebar;
