import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../utils/axios';
import { AuthContext } from '../../contexts/authContext';
import Loading from '@/Loading';

const AllIntervieweesInformation = () => {
  const [interviewees, setInterviewees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [accessToken, setAccessToken] = useState("");
    const {API_BASE_URL} =useContext(AuthContext)

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [activeFilter, accessToken]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/Learner/interviewee_student/`;
      
      if (activeFilter !== 'ALL') {
        url += `?selected_status=${activeFilter}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setInterviewees(response.data); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const refreshAllData = () => {
    setActiveFilter('ALL');
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="interviewees-container-with-bg mt-16">
      <h2 className="sponsornowHeading pt-2 text-4xl  mb-4 uppercase text-center max-w-[95vw] sm:max-w-[800px] mx-auto">
        Interviewees Information
      </h2>
      <div className="interviewees-containerYY">
        <div className="filter-buttonsYY">
          <button 
            className={`filter-btnYY ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={refreshAllData}
          >
            All
          </button>
          <button 
            className={`filter-btnYY ${activeFilter === 'TBD' ? 'active' : ''}`}
            onClick={() => setActiveFilter('TBD')}
          >
            TBD
          </button>
          <button 
            className={`filter-btnYY ${activeFilter === 'Y' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Y')}
          >
            Selected
          </button>
          <button 
            className={`filter-btnYY ${activeFilter === 'N' ? 'active' : ''}`}
            onClick={() => setActiveFilter('N')}
          >
            Not Selected
          </button>
        </div>

        {interviewees.length === 0 ? (
          <div className="alert-message">
            No interviewees found matching the selected filter.
          </div>
        ) : (
          <>
            <div className="table-wrapperS">
              <table className="interviewees-tableYY">
                <thead className='thead'>
                  <tr>
                    <th className='text-white'>ID</th>
                    <th className='text-white'>Name</th>
                    <th className='text-white'>Email</th>
                    <th className='text-white'>Mobile</th>
                    <th className='text-white'>Subrole</th>
                    <th className='text-white'>Batch</th>
                    <th className='text-nowrap text-white'>Eng Comm</th>
                    <th className='text-white'>Background</th>
                    <th className='text-white'>Laptop</th>
                    <th className='text-white'>Profession</th>
                    <th className='text-white'>Status</th>
                    <th className='text-white'>Level</th>
                    <th className='text-white'>Source</th>
                    <th className='text-white'>Remarks</th>
                    <th className='text-nowrap text-white'>Interview By</th>
                  </tr>
                </thead>
                <tbody>
                  {interviewees.map((interviewee) => (
                    <tr key={interviewee.id} className='tr'>
                      <td>{interviewee.id}</td>
                      <td className='text-nowrap capitalize'>{interviewee.name}</td>
                      <td>{interviewee.email}</td>
                      <td>{interviewee.mobile_no}</td>
                      <td>{interviewee.subrole}</td>
                      <td className='uppercase'>{interviewee.batch || 'N/A'}</td>
                      <td>{interviewee.eng_comm_skills || 'N/A'}</td>
                      <td>{interviewee.humble_background || 'N/A'}</td>
                      <td>{interviewee.laptop || 'N/A'}</td>
                      <td className='capitalize'>{interviewee.profession || 'N/A'}</td>
                      <td>
                        <span className={`status-badgeYY ${interviewee.selected_status === 'Y' ? 'selected' : 
                                         interviewee.selected_status === 'N' ? 'rejected' : 'pending'}`}>
                          {interviewee.selected_status || 'N/A'}
                        </span>
                      </td>
                      <td>{interviewee.level || 'N/A'}</td>
                      <td>{interviewee.source || 'N/A'}</td>
                      <td>{interviewee.remarks || 'N/A'}</td>
                      <td className='capitalize'>{interviewee.interview_by || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllIntervieweesInformation;