import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import Loading from '@/Loading';

export const AllBatches = () => {
  const { API_BASE_URL } = useContext(AuthContext);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(`${API_BASE_URL}/batches/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBatches(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [API_BASE_URL]);

  const handleEdit = (batchId) => {
    navigate(`/EditBatch/${batchId}`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="error">Error fetching data: {error}</div>;

  return (
    <div className="bg-gray-50 mt-16">
      <div className="batch-info-containerS">
        <h2 className="sponsornowHeading pt-2">Batch Information</h2>
        <div className="table-wrapperS overflow-y-auto">
          <table className="student-tableS">
            <thead className="thead z-2 sticky top-0">
              <tr>
                <th>Batch ID</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Capacity</th>
                <th>Time Slot</th>
                <th>Duration</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Trainers</th>
                <th>Student Count</th>
                <th>Center</th>
                <th>Actions</th> {/* New Actions column */}
              </tr>
            </thead>
            <tbody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch.id} className="tr">
                    <td>{batch.batch_id}</td>
                    <td className="capitalize text-nowrap">{batch.batch_name}</td>
                    <td className='text-nowrap'>{batch.start_date}</td>
                    <td className='text-nowrap'>{batch.end_date}</td>
                    <td>{batch.capacity}</td>
                    <td className='text-nowrap'>{batch.time_slot}</td>
                    <td>{batch.duration}</td>
                    <td>{batch.fee}</td>
                    <td>{batch.status}</td>
                    <td className='text-nowrap'>{batch.trainer.join(", ")}</td>
                    <td>{batch.student_count}</td>
                    <td>{batch.center}</td>
                    <td>
                      <button
                        className="bg-warning text-white px-3 py-1 rounded hover:bg-warning-hover"
                        onClick={() => handleEdit(batch.batch_id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center py-4">
                    No batches found
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

export default AllBatches;
