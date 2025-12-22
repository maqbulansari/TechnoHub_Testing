import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";
const AssessmentTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();
    const [hoveredRow, setHoveredRow] = useState(null);
    const { trainers, role, API_BASE_URL, fetchTrainers } = useContext(AuthContext);
    const trainerName = trainers;
    
    // Fetch trainers when component mounts
    useEffect(() => {
        if (fetchTrainers) {
            fetchTrainers();
        }
    }, [fetchTrainers]);
    
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/assessment/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const sortedData = response.data.data.sort((a, b) => a.student_name.localeCompare(b.student_name, undefined, { sensitivity: "base" }));
                setData(sortedData);
                console.log(sortedData);
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const studentNameTemplate = (rowData) => (<span style={{ color: "black"}}>
      {rowData.student_name}
    </span>);
    const trainerNameTemplate = (rowData) => (<span style={{ color: "black" }}>{rowData.selected_by_trainer}</span>);
    const batchNameTemplate = (rowData) => (<span style={{ color: "black"}}>
      {rowData.batch_name}
    </span>);
    const assessmentStatusTemplate = (rowData) => (<span style={{ color: "black"}}>
      {rowData.assessment_test_status}
    </span>);
    const adminSelectedTemplate = (rowData) => (<div className="flex align-items-center">
      <input type="checkbox" checked={rowData.admin_selected || false} readOnly className="custom-checkboxAS"/>
    </div>);
    const handleEditInterviewer = (rowData) => {
        const updatedData = data.map((item) => item.id === rowData.id ? { ...item, assessed_by: trainerName } : item);
        setData(updatedData);
        axios
            .put(`${API_BASE_URL}/assessment/update/${rowData.id}/`, {
            ...rowData,
            assessed_by: trainerName,
        })
            .then((response) => {
            console.log("Interviewer updated successfully:", response.data);
        })
            .catch((error) => {
            console.error("Error updating interviewer:", error);
        });
    };
    const handleSelectAssessment = (rowData) => {
        console.log("Selecting assessment for:", rowData);
        let id = rowData.id;
        navigate(`/AssessmentCandidte/${id}`);
    };
    const selectAssessmentTemplate = (rowData) => {
        if (rowData.selected_by_trainer === null) {
            return (<Button label="Select for Assessment" icon="pi pi-user-plus" className="btn btn-primary w-full" 
            // className="p-button-sm custom-edit-button"
            style={{
                    background: hoveredRow === rowData.id
                        ? "var(--bs-info)"
                        : "rgb(92, 160, 232)",
                }} onMouseEnter={() => setHoveredRow(rowData.id)} onMouseLeave={() => setHoveredRow(null)} onClick={() => handleEditInterviewer(rowData)}/>);
        }
        else {
            return (<Button label="Update Details" icon="pi pi-check" 
            // className="p-button-sm custom-edit-button"
            className="btn btn-primary w-full" onClick={() => handleSelectAssessment(rowData)}/>);
        }
    };
    const handleStudentInformation = () => {
        navigate("/StudentInformation");
    };
    if (loading) {
        return ( <Loading/>);
    }
    if (error) {
        return <div className="error">Error fetching data: {error}</div>;
    }
    return (<div className="container mt-16">
      <div className="header-containerH flex flex-column align-items-center mb-3 relative">
        {/* <h2 className="header-titleH">ASSESSMENTS</h2> */}
       
         <h1 className="sponsornowHeading header-titleH text-center flex flex-column absolute top-5">
        ASSESSMENTS
      </h1><br></br><br></br>
      </div>
      {/* <div className="w-100 flex justify-content-end px-3"> */}
      <div className="header-containerH ">

        <Button 
    // className="header-buttonH mb-1"
    className="btn btn-primary text" label="All Student Information" severity="info" onClick={handleStudentInformation}/>
      </div>
      <br />

      <div className="card">
        {/* paginator rows={20} */}
        <DataTable value={data} stripedRows>
          <Column field="student_name" header="Student Name" body={studentNameTemplate} sortable className="text-nowrap capitalize"></Column>
          <Column field="assessed_by" header="Trainer Name" body={trainerNameTemplate} sortable className="text-nowrap capitalize"></Column>
          <Column field="batch_name" header="Batch Name" body={batchNameTemplate} sortable className="text-nowrap capitalize"></Column>
          {/* <Column
          field="assessment_test_status"
          header="Assessment Status"
          body={assessmentStatusTemplate}
          sortable
        ></Column> */}
          
          {/* Conditionally render Admin fields if role is ADMIN */}
          {role === "ADMIN" && (<Column field="admin_selected" header="Approved by Admin" body={adminSelectedTemplate} sortable></Column>)}
            
          <Column header="Actions" body={selectAssessmentTemplate} className="text-nowrap"></Column>
        </DataTable>
      </div>
          {submitSuccess && (<div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Register</h5>
                  <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
                </div>

                <div className="modal-body">
                  <p> User successfully created!</p>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => setSubmitSuccess(false)} data-bs-dismiss="modal">
                    
                  </button>
                </div>
              </div>
            </div>
          </div>)}
    </div>);
};
export default AssessmentTable;
