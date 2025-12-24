import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

const AdmissionTable = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [hoveredRow, setHoveredRow] = useState(null);
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(true);

    const { trainers, admin, API_BASE_URL, fetchTrainers, fetchAdmin, user } = useContext(AuthContext);

    const trainerName = `${user?.first_name} ${user?.last_name}` || "N/A";

    // Fetch trainers and admin on mount
    useEffect(() => {
        if (fetchTrainers) fetchTrainers();
        if (fetchAdmin) fetchAdmin();
    }, []);

    // Fetch real admission data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) setAccessToken(token);

                const response = await axios.get(`${API_BASE_URL}/Learner/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [API_BASE_URL]);

 

    const nameTemplate = (rowData) => <span className="table-cell-text">{rowData.name}</span>;
    const emailTemplate = (rowData) => <span className="table-cell-text">{rowData.email}</span>;
    const mobileTemplate = (rowData) => <span className="table-cell-text">{rowData.mobile_no || "N/A"}</span>;
    const interviewByTemplate = (rowData) => <span className="table-cell-text">{rowData.interview_by || "N/A"}</span>;

    const handleEditInterviewer = async (rowData) => {
        const updatedData = data.map((item) =>
            item.id === rowData.id ? { ...item, interview_by: trainerName } : item
        );
        setData(updatedData);

        try {
            await axios.put(
                `${API_BASE_URL}/Learner/${rowData.id}/update_selected/`,
                { ...rowData, interview_by: trainerName },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            console.log("Interviewer updated successfully");
        } catch (error) {
            console.error("Error updating interviewer:", error);
        }
    };

    const handleEdit = (rowData) => {
        navigate(`/interview-candidate/${rowData.id}`, { state: { candidateData: rowData } });
    };

    const editTemplate = (rowData) => {
        if (!rowData.interview_by) {
            return (
                <Button
                    label="Select"
                    icon="pi pi-user-plus"
                    className="btn btn-primary w-full"
                    style={{ background: hoveredRow === rowData.id ? "var(--bs-info)" : "rgb(92, 160, 232)" }}
                    onMouseEnter={() => setHoveredRow(rowData.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => handleEditInterviewer(rowData)}
                />
            );
        } else {
            return (
                <Button
                    label="Update"
                    icon="pi pi-pencil"
                    className="btn btn-primary w-full"
                    onClick={() => handleEdit(rowData)}
                />
            );
        }
    };

    const handleAllIntervieweesInformationClick = () => navigate("/AllIntervieweesInformation");
    const handleAssignBatchClick = () => navigate("/AssignBatch");

    if (loading) return <Loading />;

    return (
        <div className="container mt-16">
            <div className="text-center mb-4">
                <h2 className="sponsornowHeading pt-4">Interviewees</h2>
                <Button className="btn btn-primary me-2" label="Assign Batch For Students" onClick={handleAssignBatchClick} />
                <Button className="btn btn-primary" label="All Interviewees Information" onClick={handleAllIntervieweesInformationClick} />
            </div>

            <div className="card">
                <DataTable
                    value={data}
                    stripedRows
                    className="admission-table"
                    emptyMessage={<div className="text-center py-4 text-gray-500">No data available</div>}
                >
                    <Column field="name" header="Name" body={nameTemplate} sortable className="text-nowrap"></Column>
                    <Column field="email" header="Email" body={emailTemplate} sortable></Column>
                    <Column field="mobile_no" header="Mobile No" body={mobileTemplate} sortable></Column>
                    <Column field="interview_by" header="Interviewer Name" body={interviewByTemplate} sortable className="text-nowrap"></Column>
                    <Column header="Actions" body={editTemplate} className="text-nowrap"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default AdmissionTable;
