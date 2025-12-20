import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import Loading from '@/Loading';

const AllStudent = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API_BASE_URL } = useContext(AuthContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/Learner/interviewee_student/?selected_status=Y`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudentData(response.data);
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return <div className="error">Error fetching data: {error}</div>;
  }

  return (
    <div className='bg-gray-50'>
      <div className="student-info-containerS">
        <h2 className="sponsornowHeading pt-2 text-4xl mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
          Student Information
        </h2>
        <div className="table-wrapperS overflow-y-auto ">
          <table className="student-tableS">
            <thead className='thead z-2 sticky top-0'>
              <tr>
                <th className='text-white'>Name</th>
                <th className='text-white'>Email</th>
                <th className='text-white'>Mobile No</th>
                <th className='text-white'>Gender</th>
                <th className='text-white'>Batch</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((student) => (
                  <tr key={student.id || student.email} className='tr'>
                    <td className="student-nameS capitalize text-nowrap">{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.mobile_no}</td>
                    <td>{student.gender}</td>
                    <td><span className="batch-tagS uppercase">{student.batch || "N/A"}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllStudent;
