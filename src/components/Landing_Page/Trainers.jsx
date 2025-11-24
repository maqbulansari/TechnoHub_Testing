import { useContext, useEffect, useState } from "react";
import axios from "axios";
import user from "../../assets/images/trainers/user.png";
import { AuthContext } from "../../contexts/authContext";

export const Trainers = () => {
  const { allTrainer, fetchAllTrainer, API_BASE_URL } = useContext(AuthContext);
  const [trainerDetails, setTrainerDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If allTrainer is available from context, use it
    if (allTrainer && allTrainer.length > 0) {
      setTrainerDetails(allTrainer);
      setLoading(false);
    } else if (fetchAllTrainer) {
      // Otherwise, fetch it
      fetchAllTrainer().then(() => {
        // After fetch, allTrainer will be updated in context
        if (allTrainer && allTrainer.length > 0) {
          setTrainerDetails(allTrainer);
          setLoading(false);
        }
      });
    } else if (API_BASE_URL) {
      // Fallback: fetch directly if context methods not available (public page)
      const fetchTrainers = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/trainers/`);
          if (response.status === 200) {
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setTrainerDetails(data);
          }
        } catch (error) {
          console.error("Error fetching trainers:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTrainers();
    }
  }, [allTrainer, fetchAllTrainer, API_BASE_URL]);

  useEffect(() => {
    if (allTrainer && allTrainer.length > 0) {
      setTrainerDetails(allTrainer);
    }
  }, [allTrainer]);
  
  if (loading) {
    return <div>Loading trainers...</div>;
  }
  
  return (
    <div className="col-xxl-12 col-xl-12 col-md-12 px-0"><br/>
      <div className="scrollbar-wrappercenter">
        <div className="row mx-0 flex-nowrap">
          {trainerDetails.map((trainer) => (
            <div className="col-xxl-3 col-xl-3 col-md-3" key={trainer.id}>
              <div className="card">
                <img 
                  src={trainer.user_profile || user} 
                  alt={`${trainer.first_name} ${trainer.last_name}`} 
                  className="cardImage" 
                  onError={(e) => {
                    e.target.src = user; 
                  }}
                />
                <div className="card-body min-bodyHeight capitalize">
                  <h2>{trainer.first_name} {trainer.last_name}</h2>
                  <p className="trainer-skills">
                    <i className="fa-solid fa-star text-warning me-1"></i>
                    {trainer.job_title}
                  </p>
                  <p className="card-text">
                    <span className="fw-bold">Technology:</span>{" "}
                    {trainer.technologies?.join(", ") || "Not specified"}
                  </p>
                  <p className="card-text">
                    <span className="fw-bold">Skills:</span>{" "}
                    {trainer.required_skills || "Not specified"}
                  </p>
                  <p className="card-text">
                    <span className="fw-bold">Experience:</span>{" "}
                    {trainer.experience ? `${trainer.experience} years` : "Not specified"}
                  </p>
                  <p className="card-text">
                    <span className="fw-bold">Qualification:</span>{" "}
                    {trainer.qualification || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};