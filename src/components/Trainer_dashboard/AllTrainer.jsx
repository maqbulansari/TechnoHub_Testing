import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/authContext";

const AllTrainer = () => {
  const { allTrainer, error, fetchAllTrainer } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // Fetch trainers when component mounts
  useEffect(() => {
    if (fetchAllTrainer) {
      fetchAllTrainer();
    }
  }, [fetchAllTrainer]);

  useEffect(() => {
    if (allTrainer && allTrainer.length > 0) {
      setLoading(false);
    }
  }, [allTrainer]);


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
    <div className="student-info-containerS">

      <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
        Trainer Information
      </h2>

      <div className="table-wrapperS">
        <table className="student-tableS">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-nowrap">Job Title</th>
              <th>Experience</th>
              <th>Technologies</th>
              <th className="text-nowrap">Batches - Centers</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {trainerData.map((trainer) => (
              <tr key={trainer.id}>
                <td className="student-nameS text-nowrap capitalize">
                  {trainer.first_name} {trainer.last_name}
                </td>
                <td className="capitalize text-nowrap">{trainer.job_title}</td>
                <td>{trainer.experience} years</td>
                <td>
                  {trainer.technologies &&
                    trainer.technologies.map((tech, index) => (
                      <span key={index} className="batch-tagS capitalize">
                        {tech}
                      </span>
                    ))}
                </td>
                <td className="batchAll-center-container">
                  {trainer.batches && trainer.batches.length > 0 ? (
                    <>
                      {trainer.batches.map((batch, index) => (
                        <span key={index} className="batchAll-center-tag">
                          <span className="batchAll-name">{batch.batch_name}</span>
                          {/* {trainer.centers[index] && (
                            <> */}
                          <span className="separatorAll">→</span>
                          <span className="centerAll-name">
                            {batch.center}
                          </span>
                          {/* </>
                          )} */}
                        </span>
                      ))}
                    </>
                  ) : (
                    "N/A"
                  )}
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
  );
};

export default AllTrainer;
