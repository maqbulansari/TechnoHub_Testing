import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';

const AllStudent = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {API_BASE_URL} =useContext(AuthContext)

  useEffect(() => {
    const fetchStudentData = async () => {
        const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/Learner/interviewee_student/?selected_status=Y` , {
            headers: {
              Authorization: `Bearer ${token}`,
            },
      });
        console.log(response);
        
        setStudentData(response.data);
      } catch (err) {
        setError(err.message);
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading ...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error fetching data: {error}</div>;
  }

  return (
    <div className="student-info-containerS">
      {/* <h2 className="table-titleS uppercase">Student Information</h2> */}
       <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
        Student Information
      </h2>
      <div className="table-wrapperS">
        <table className="student-tableS">
          <thead className='thead'>
            <tr>
              <th className='text-white'>Name</th>
              <th className='text-white'>Email</th>
              <th className='text-white'>Mobile No</th>
              <th className='text-white'>Gender</th>
              <th className='text-white'>Batch</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student) => (
              <tr key={student.id || student.email} className='tr'>
                <td className="student-nameS capitalize text-nowrap">{student.name}</td>
                <td>{student.email}</td>
                <td>{student.mobile_no}</td>
                <td>{student.gender}</td>
                <td><span className="batch-tagS uppercase">{student.batch}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudent;

