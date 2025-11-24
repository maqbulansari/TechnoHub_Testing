// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { baseURL } from "../../utils/axios";
// interface Student {
//   student_name: string;
//   student_id: number;
//   batch_name: string;
//   is_sponsored: boolean;
// }
// interface Batch {
//   batch_name: string;
//   start_date: string;
//   trainers: string[];
//   duration: string;
//   technologies: string[];
//   student: Student;
// }
// const StudentsBatches: React.FC = () => {
//   const [batch, setBatch] = useState<Batch | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${baseURL}/batches/students_in_batch/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log(response.data);
//         setBatch(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setBatch(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);
//   if (loading) {
//     return (
//       <div className="loading-containerHSB">
//         <div className="loading-spinnerHSB"></div>
//         <p>Loading batch information...</p>
//       </div>
//     );
//   }
//   if (!batch) {
//     return (
//       <div className="error-containerHSB">
//         <div className="error-iconHSB">⚠️</div>
//         <h2>No batch data available</h2>
//         <p>Please check your connection or contact support</p>
//       </div>
//     );
//   }
//   return (
//     <div className="batches-containerHSB">
//       <h1 className="batches-titleHSB">Student Batch Information</h1>
//       <div className="batches-gridHSB">
//         <div className="batch-cardHSB">
//           <div className="batch-card-headerHSB">
//             <h2 className="batch-nameHSB text-uppercase">{batch.batch_name}</h2>
//           </div>
//           <div className="batch-card-bodyHSB">
//             <div className="batch-infoHSB">
//               <div className="info-itemHSB">
//                 <span className="info-labelHSB">Start Date:</span>
//                 <span className="info-valueHSB">{batch.start_date}</span>
//               </div>
//               <div className="info-itemHSB">
//                 <span className="info-labelHSB">Trainer:</span>
//                 <span className="trainer-listHSB">
//                   {batch.trainers.map((trainer, index) => (
//                     <span key={index} className="trainer-itemHSB uppercase">
//                      | {trainer} |
//                     </span>
//                   ))}</span>
//               </div>
//               <div className="info-itemHSB">
//                 <span className="info-labelHSB">Duration:</span>
//                 <span className="info-valueHSB">{batch.duration}</span>
//               </div>
//               <div className="info-itemHSB">
//                 <span className="info-labelHSB">Technologies:</span>
//                 <div className="tech-tagsHSB">
//                   {batch.technologies.map((tech, index) => (
//                     <span key={index} className="tech-tagHSB">
//                       {tech}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default StudentsBatches;
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
const StudentsBatches = () => {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const { API_BASE_URL } = useContext(AuthContext);
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/batches/students_in_batch/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setBatch(response.data);
            }
            catch (error) {
                console.error("Error fetching data:", error);
                setBatch(null);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading) {
        return (<div className="loading-minimal">
        <div className="dot-flashing"></div>
        <span className="ml-4">Loading ...</span>
      </div>);
    }
    if (!batch) {
        return (<div className="error-containerHSB">
        <div className="error-iconHSB">⚠️</div>
        <h2>No batch data available</h2>
        <p>Please check your connection or contact support</p>
      </div>);
    }
    return (<div className="batches-containerHSB">
      <h1 className="batches-titleHSB">Student Batch Information</h1>
      <div className="batches-gridHSB">
        <div className="batch-cardHSB">
          <div className="batch-card-headerHSB">
            <h2 className="batch-nameHSB text-uppercase">{batch.batch_name}</h2>
          </div>
          <div className="batch-card-bodyHSB">
            <div className="batch-infoHSB">
              <div className="info-itemHSB">
                <span className="info-labelHSB">Start Date:</span>
                <span className="info-valueHSB">{batch.start_date}</span>
              </div>
              <div className="info-itemHSB">
                <span className="info-labelHSB">Trainer:</span>
                <span className="trainer-listHSB">
                  {batch.trainers.map((trainer, index) => (<span key={index} className="trainer-itemHSB uppercase">
                      | {trainer} |
                    </span>))}</span>
              </div>
              <div className="info-itemHSB">
                <span className="info-labelHSB">Duration:</span>
                <span className="info-valueHSB">{batch.duration}</span>
              </div>
              <div className="info-itemHSB">
                <span className="info-labelHSB">Technologies:</span>
                <div className="tech-tagsHSB">
                  {batch.technologies.map((tech, index) => (<span key={index} className="tech-tagHSB">
                      {tech}
                    </span>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default StudentsBatches;
