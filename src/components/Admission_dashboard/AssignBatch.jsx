import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";

const AssignBatch = () => {
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [learners, setLearners] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { API_BASE_URL } = useContext(AuthContext);
  const [accessToken, setAccessToken] = useState(null);

  // Get token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    } else {
      setError("No access token found");
      setLoading(false);
    }
  }, []);

  // Fetch batches
  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/batches/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError(err.response?.data?.detail || "Failed to fetch batches");
    }
  };

  // Fetch learners
  const fetchLearners = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/Learner/selected_without_batch/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setLearners(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      setLoading(false);
    }
  };

  // Fetch data when accessToken is ready
  useEffect(() => {
    if (accessToken) {
      fetchLearners();
      fetchBatches();
    }
  }, [accessToken]);

  const handleSelectLearner = (learnerId) => {
    if (selectedLearners.includes(learnerId)) {
      setSelectedLearners(selectedLearners.filter((id) => id !== learnerId));
    } else {
      setSelectedLearners([...selectedLearners, learnerId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLearners([]);
    } else {
      setSelectedLearners(learners.map((learner) => learner.id));
    }
    setSelectAll(!selectAll);
  };

  const handleAssignBatchClick = () => setShowDialog(true);
  const handleDialogClose = () => {
    setShowDialog(false);
    setSelectedBatch("");
  };

  const handleBatchAssignConfirm = async () => {
    if (!selectedBatch) {
      alert("Please select a batch");
      return;
    }

    if (!accessToken) {
      alert("No authentication token available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_BASE_URL}/Learner/assign_batch/`,
        {
          learner_ids: selectedLearners,
          batch_id: selectedBatch,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Remove assigned learners from the list
      setLearners(learners.filter((learner) => !selectedLearners.includes(learner.id)));

      setSelectedLearners([]);
      setSelectAll(false);
      setSelectedBatch("");
      setShowDialog(false);
    } catch (err) {
      // Display API error
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading/>
    );
  }
  if (error) {
    return (
     <div className="assign-batch-container-with-bg mt-16">
      <div className="assign-batch-container">
        <div className="header-containerH d-flex justify-center w-100 ">
          <h2 className="sponsornowHeading pt-2 text-4xl mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
            Assign Batch to Students
          </h2>
        </div><div className="alert alert-danger text-center">{error}</div> </div>
        </div>
    );
  }

  return (
    <div className="assign-batch-container-with-bg mt-16">
      <div className="assign-batch-container">
        <div className="header-containerH d-flex justify-center w-100 ">
          <h2 className="sponsornowHeading pt-2 text-4xl mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
            Assign Batch to Students
          </h2>
        </div>

        {/* Display error if exists */}
        {/* {error && <div className="alert alert-danger text-center">{error}</div>} */}

        {learners.length === 0 ? (
          <div className="alert alert-info pt-3 text-center">
            All Students have been assigned to batches.
          </div>
        ) : (
          <>
            <div className="table-wrapperS">
              <table className="student-tableS">
                <thead className="thead">
                  <tr>
                    <th>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th className="text-white">Name</th>
                    <th className="text-white">Email</th>
                    <th className="text-white">Mobile</th>
                    <th className="text-white">Level</th>
                    <th className="text-white">Laptop</th>
                    <th className="text-white">Interview By</th>
                  </tr>
                </thead>
                <tbody>
                  {learners.map((learner) => (
                    <tr key={learner.id} className="tr">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedLearners.includes(learner.id)}
                          onChange={() => handleSelectLearner(learner.id)}
                        />
                      </td>
                      <td className="capitalize">{learner.name}</td>
                      <td>{learner.email}</td>
                      <td>{learner.mobile_no}</td>
                      <td>{learner.level}</td>
                      <td>{learner.laptop === "Y" ? "Yes" : "No"}</td>
                      <td className="capitalize">{learner.interview_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile view */}
              <div className="d-md-none">
                {learners.map((learner) => (
                  <div
                    key={learner.id}
                    className={`mobile-learner-card ${selectedLearners.includes(learner.id) ? "selected" : ""}`}
                    onClick={() => handleSelectLearner(learner.id)}
                  >
                    <div className="card-header">
                      <input
                        type="checkbox"
                        checked={selectedLearners.includes(learner.id)}
                        onChange={() => handleSelectLearner(learner.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="learner-name">{learner.name}</span>
                    </div>
                    <div className="card-details">
                      <div><span>Email:</span> {learner.email}</div>
                      <div><span>Mobile:</span> {learner.mobile_no}</div>
                      <div><span>Level:</span> {learner.level}</div>
                      <div><span>Laptop:</span> {learner.laptop === "Y" ? "Yes" : "No"}</div>
                      <div><span>Interview By:</span> {learner.interview_by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="action-buttonsA text-center">
              <button
                className="btn btn-primary"
                onClick={handleAssignBatchClick}
                disabled={selectedLearners.length === 0}
              >
                Assign Batch to Selected ({selectedLearners.length})
              </button>
            </div>
          </>
        )}
      </div>

      {/* Dialog Box */}
      {showDialog && (
        <div className="dialog-overlayA">
          <div className="dialog-boxA">
            <h3>Assign Batch</h3>
            <p>Select a batch for the selected learners:</p>
            <select
              className="form-selectA capitalize"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Select batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.batch_id}>
                  {batch.batch_name}
                </option>
              ))}
            </select>
            <div className="dialog-actionsA">
              <button className="btn btn-secondary" onClick={handleDialogClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleBatchAssignConfirm} disabled={!selectedBatch}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignBatch;
