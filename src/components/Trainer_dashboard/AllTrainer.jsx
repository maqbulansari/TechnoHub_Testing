import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";


const AllTrainer = () => {
  const { error, API_BASE_URL } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [allTrainer, setAllTrainer] = useState([]);

  const newaccessToken = localStorage.getItem("accessToken");

  const fetchAllTrainer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trainers/`, {
        headers: { Authorization: `Bearer ${newaccessToken}` },
      });
      if (response.status === 200) {
        setAllTrainer(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching Trainers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trainers when component mounts
  // useEffect(() => {
  //   if (fetchAllTrainer) {
  //     fetchAllTrainer();
  //   }
  // }, [fetchAllTrainer]);

  useEffect(() => {
    fetchAllTrainer()
  }, []);


  const trainerData = allTrainer;

  if (loading) {
    return (
      <div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading...</span>
      </div>
    );
  }

  console.log(trainerData);
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className='bg-gray-50'>
      <div className="student-info-containerS">

        <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
          Trainer Information
        </h2>

        <div className="table-wrapperS">
          <table className="student-tableS">
            <thead className="thead top-0 sticky">
              <tr>
                <th className='text-white'>Name</th>
                <th className="text-nowrap text-white">Job Title</th>
                <th className='text-white'>Experience</th>
                <th className='text-white'>Technologies</th>
                {/* <th className="text-nowrap text-white">Batches - Centers</th> */}
                <th className='text-white'>Email</th>
                <th className='text-white'>Mobile</th>
                <th className='text-white'>Gender</th>
              </tr>
            </thead>
            <tbody>
              {trainerData.length == 0 ? <div className="text-center w-full py-4">
                <span className="text-gray-500 text-nowrap">No data available</span>
              </div> : trainerData.map((trainer) => (
                <tr key={trainer.id} className="tr">
                  <td className="student-nameS text-nowrap capitalize">
                    {trainer.first_name} {trainer.last_name}
                  </td>
                  <td className="capitalize text-nowrap">{trainer.job_title}</td>
                  <td>{trainer.experience} years</td>
                  <td>
                    {trainer.technologies &&
                      trainer.technologies.map((tech, index) => (
                        <span key={index} className="batch-tagS uppercase">
                          {tech}
                        </span>
                      ))}
                  </td>
                
                  <td className="text-nowrap">{trainer.email}</td>
                  <td>{trainer.mobile_no || "N/A"}</td>
                  <td>{trainer.gender || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllTrainer;
