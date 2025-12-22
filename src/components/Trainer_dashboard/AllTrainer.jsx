import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";
import Loading from "@/Loading";


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
    <Loading/>
    );
  }

  console.log(trainerData);
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className='bg-gray-50'>
      <div className="student-info-containerS">

        <h2 className="sponsornowHeading pt-2">
          Trainer Information
        </h2>

        <div className="table-wrapperS">
          <table className="student-tableS">
            <thead className="thead top-0 sticky">
              <tr>
                <th className=''>Name</th>
                <th className="text-nowrap ">Job Title</th>
                <th className=''>Experience</th>
                <th className=''>Technologies</th>
                {/* <th className="text-nowrap ">Batches - Centers</th> */}
                <th className=''>Email</th>
                <th className=''>Mobile</th>
                <th className=''>Gender</th>
              </tr>
            </thead>
            <tbody>
              {trainerData.length == 0 ? 
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No trainers found
                  </td>
                </tr>
               : trainerData.map((trainer) => (
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