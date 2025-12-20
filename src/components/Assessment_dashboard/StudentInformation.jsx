import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/authContext';
import Loading from '@/Loading';

const StudentInformation = () => {
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { API_BASE_URL } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/assessment/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedStudents = response.data.data.sort((a, b) =>
          a.student_name.localeCompare(b.student_name, undefined, { sensitivity: "base" })
        );

        setStudentData(sortedStudents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [API_BASE_URL]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error text-center">Error fetching data: {error}</div>;
  }

  return (
    <div className="student-info-containerS">
      <h1 className="sponsornowHeading header-titleH text-center flex flex-column absolute top-5 w-full">
        Student Information
      </h1>
      <br /><br /><br /><br />
      <div className="table-wrapperS">
        <table className="student-tableS">
          <thead className='thead'>
            <tr>
              <th className='text-white'>Student Name</th>
              <th className='text-white'>Batch</th>
              <th className='text-white'>Center</th>
              <th className='text-white'>Selected By Trainer</th>
            </tr>
          </thead>
          <tbody>
            {studentData.length > 0 ? (
              studentData.map((student) => (
                <tr key={student.id} className='tr'>
                  <td className="student-nameS text-nowrap capitalize">{student.student_name}</td>
                  <td><span className="batch-tagS text-nowrap uppercase">{student.batch_name}</span></td>
                  <td><span className='text-nowrap capitalize'>{student.center}</span></td>
                  <td><span className='text-nowrap capitalize'>{student.selected_by_trainer}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentInformation;
