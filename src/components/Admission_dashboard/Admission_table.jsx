import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
const AdmissionTable = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [hoveredRow, setHoveredRow] = useState(null);
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(true);
    
    const { trainers, admin, API_BASE_URL, fetchTrainers, fetchAdmin } = useContext(AuthContext);

  
    const trainerName =  window.localStorage.getItem("first_name")  + " " + window.localStorage.getItem("last_name") || "N/A"
    
    

    // Fetch trainers and admin when component mounts
    useEffect(() => {
        if (fetchTrainers) fetchTrainers();
        if (fetchAdmin) fetchAdmin();
    }, [fetchTrainers, fetchAdmin]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                setAccessToken(token);
            }
            try {
                const response = await axios.get(`${API_BASE_URL}/Learner/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data);
                  setLoading(false);
            }
            catch (error) {
                console.error("Error fetching data:", error);
                  setLoading(false);
            }
        };
        fetchData();
    }, []);
    const nameTemplate = (rowData) => (<span style={{ color: "black" }}>{rowData.name}</span>);
    const emailTemplate = (rowData) => (<span style={{ color: "black" }}>{rowData.email}</span>);
    const mobileTemplate = (rowData) => (<span style={{ color: "black" }}>
        {rowData.mobile_no}
    </span>);
    const interviewByTemplate = (rowData) => (<span style={{ color: "black" }}>
        {rowData.interview_by || "N/A"}
    </span>);
    const handleEditInterviewer = (rowData) => {
        const updatedData = data.map((item) => item.id === rowData.id ? { ...item, interview_by: trainerName } : item);
        setData(updatedData);
        axios
            .put(`${API_BASE_URL}/Learner/${rowData.id}/update_selected/`, {
                ...rowData,
                interview_by: trainerName,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                console.log("Interviewer updated successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error updating interviewer:", error);
            });
    };
    const handleEdit = (rowData) => {
        console.log("Editing row:", rowData);
        navigate(`/interview-candidate/${rowData.id}`, {
            state: { candidateData: rowData },
        });
    };
    const editTemplate = (rowData) => {
        if (rowData.interview_by === null) {
            return (<Button label="Select for interview" icon="pi pi-user-plus"
                // className="p-button-sm custom-edit-button"
                className="btn btn-primary w-full" style={{
                    background: hoveredRow === rowData.id
                        ? "var(--bs-info)"
                        : "rgb(92, 160, 232)",
                }} onMouseEnter={() => setHoveredRow(rowData.id)} onMouseLeave={() => setHoveredRow(null)} onClick={() => handleEditInterviewer(rowData)} />);
        }
        else {
            return (<Button label="Update Details" icon="pi pi-pencil"
                // className="p-button-sm custom-edit-button"
                className="btn btn-primary w-full" onClick={() => handleEdit(rowData)} />);
        }
    };
    const handleAllIntervieweesInformationClick = () => {
        navigate("/AllIntervieweesInformation");
    };
    const handleAssignBatchClick = () => {
        navigate("/AssignBatch");
    };

      if (loading) {
    return (
      <div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading ...</span>
      </div>
    );
  }
    return (<div className="container mt-4">
        <div className="flex  w-full">
            <div className="header-containerH d-flex justify-center w-100 ">
                <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
                    INTERVIEWEES
                </h2>
            </div>

        </div>
        <div className="header-containerH ">
            <Button
                // className="header-buttonL mb-1"
                className="btn btn-primary" label="Assign Batch For Students" severity="info" onClick={handleAssignBatchClick} />

            <Button
                // className="header-buttonH mb-1"
                className="btn btn-primary text-nowrap " label="All Interviewees Information" severity="info" onClick={handleAllIntervieweesInformationClick} />
        </div>

        <div className="card">
            {/* paginator rows={20} */}
            <DataTable value={data} stripedRows
                emptyMessage={
                    <div className="text-center w-full py-4">
                        <span className="text-gray-500">No data available</span>
                    </div>
                }>
                <Column field="name" header="Name" body={nameTemplate} sortable className="text-nowrap capitalize"></Column>
                <Column field="email" header="Email" body={emailTemplate} sortable></Column>
                <Column field="mobile_no" header="Mobile No" body={mobileTemplate} sortable></Column>
                <Column field="interview_by" header="Interviewer Name" body={interviewByTemplate} sortable className="text-nowrap capitalize"></Column>
                <Column header="Actions" body={editTemplate} className="text-nowrap"></Column>
            </DataTable>
        </div>
    </div>);
};
export default AdmissionTable;
