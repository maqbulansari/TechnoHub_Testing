import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
const TrainerBatchDetail = () => {
    const { batchId } = useParams();
    const [batchDetail, setBatchDetail] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState("");
    const [isSubmiting, setIsSubmiting] = useState(false);
    const { API_BASE_URL } = useContext(AuthContext);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setAccessToken(token);
        }
        const fetchBatchDetail = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/trainers/batches/${batchId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBatchDetail(response.data.data);
            }
            catch (error) {
                console.error("Error fetching batch detail:", error);
            }
        };
        fetchBatchDetail();
    }, [batchId]);
    // Handle student selection
    const onStudentSelect = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
        }
        else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };
    // Handle form submission
    const handleSubmit = async () => {
        if (!batchDetail)
            return;
        const payload = {
            batch_id: batchDetail.batch_id,
            student_ids: selectedStudents,
        };
        setIsSubmiting(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/Trainer/trainer_select/`, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSubmitSuccess(true);
            // alert("Students selected successfully!");
            // navigate("/Trainer_batch");
            // window.location.reload();
        }
        catch (error) {
            console.error("Error submitting selected students:", error);
            // alert("Failed to select students.");
        }
        finally {
            setIsSubmiting(false);
        }
    };
    if (!batchDetail) {
        return (<div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading ...</span>
      </div>);
    }
    const handleOnclseModal = () => {
        setSubmitSuccess(false);
        navigate("/Trainer_batch");
    };
    return (<div className="trainer-batch-detail-container">
      <div className="batch-headerTBD">
        {/* <h2> */}
        <span className="text-white text-5xl capitalize">Batch: {batchDetail.batch_name}</span><br></br>
        <span className="text-white text-4xl capitalize">Center: {batchDetail.center}</span>
        {/* </h2> */}
      </div>

      <div className="batch-infoTBD">
        <div className="info-itemTBD">
          <span className="info-labelTBD">Number of Students:</span>
          <span className="info-valueTBD">{batchDetail.student_count}</span>
        </div>
        <div className="info-itemTBD">
          <span className="info-labelTBD">Technologies:</span>
          <span className="info-valueTBD capitalize">
            {batchDetail.technologies.map((e) => e.technology_name).join(", ")}
          </span>
        </div>
      </div>

      <div className="student-name-section">
        <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
        Student Names
      </h2>
        <DataTable value={[...batchDetail.students].sort((a, b) => a.student_name.localeCompare(b.student_name))} className="p-datatable-striped p-datatable-gridlines custom-datatableTBD">

          <Column field="student_name" header="Student Name" sortable body={(rowData) => (<span className="student-name-gradient capitalize">
                {rowData.student_name}
              </span>)}/>
          <Column header="INDUSTRY READY" body={(rowData) => (<Checkbox checked={rowData.trainer_is_selected ||
                selectedStudents.includes(rowData.student_id)} onChange={() => onStudentSelect(rowData.student_id)} disabled={rowData.trainer_is_selected} className={rowData.trainer_is_selected ? "checked-designH" : ""}/>)} className="align-end-columnH"/>
        </DataTable>
        {/* <button onClick={handleSubmit} className="submit-buttonH">
          Submit For Assessment
        </button> */}
        <button type="submit" onClick={handleSubmit} className={`submit-buttonH w-40 ${selectedStudents.length === 0 || isSubmiting ? "opacity-50 cursor-not-allowed" : ""}`} disabled={selectedStudents.length === 0 || isSubmiting}>
          {isSubmiting ? (<>
              <span className="fas fa-spinner fa-spin me-2"></span>
              Submitting...
            </>) : ("Submit For Assessment")}
        </button>

      </div>

            {submitSuccess && (<div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Trainer Batch</h5>
                  <button type="button" className="btn-close" onClick={() => handleOnclseModal()}></button>
                </div>

                <div className="modal-body">
                  <p>Students selected successfully!</p>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => handleOnclseModal()} data-bs-dismiss="modal">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>)}
    </div>);
};
export default TrainerBatchDetail;
