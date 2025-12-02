import React, { useContext, useEffect, useState } from "react";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TrainerImage from "../../assets/images/trainers/Trainer.jpg";
import { baseURL } from "../../utils/axios";
import { AuthContext } from "../../contexts/authContext";

const TrainerBatch = () => {
  const{loginSuccess, setLoginSuccess}=useContext(AuthContext)
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();
     const {API_BASE_URL} =useContext(AuthContext)
  useEffect(() => {
  if (loginSuccess) {
    setShowModal(true);

    const timeout = setTimeout(() => {
      setShowModal(false);
      setLoginSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }
}, [loginSuccess]);

  // Fetch batch data from the API
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchBatches = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/trainers/batches/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data.batches);
        setBatches(response.data.data.batches);
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }
    };

    fetchBatches();
  }, []);

  
  // Function to handle card click
  const handleCardClick = (batchId) => {
    console.log(batches);
    console.log("Navigating to batch ID:", batchId);
    navigate(`/TrainerBatchDetail/${batchId}`); // Navigate to /TrainerBatchDetail with batch ID
  };

  return (
    <>
      <div>
        <Card title="Your Batches" className="custom-cardH3 m-5 text-black">
          <h3 className="m-0 text-black">For Trainer</h3>
        </Card>

        {/* Flex container with wrapping */}
        <div className="flex flex-wrap gap-5 m-5 w-full pl-4">
          {/* Map over the batches array to render multiple cards */}
          {batches.map((batch) => (
            <div
              key={batch.batch_id} // Use batch ID as the key
              className="card trainer-batch-cardH2 w-1/4 min-w-[250px]"
              onClick={() => handleCardClick(batch.batch_id)} // Pass batch ID to handleCardClick
              style={{ cursor: "pointer" }} // Change cursor to pointer to indicate clickability
            >
              <img
                src={TrainerImage}
                className="card-img-topH2"
                alt={batch.batch_name}
              />
              <div className="card-bodyH2">
                <h5 className="card-titleH2 uppercase">{batch.batch_name}</h5>
                <p className="card-textH2">
                  Current Students: {batch.student_count} <br/>
                  Center: {batch.center}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
       {showModal && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Welcome</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          <p>Login successful!</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowModal(false)}
            data-bs-dismiss="modal"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default TrainerBatch;
