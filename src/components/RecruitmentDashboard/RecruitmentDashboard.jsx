import React, { useEffect,useContext, useState } from "react";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import bgSponser from "../../assets/images/sponserDashboard/bgSponser.png";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";

export const RecruitmentDashboard = () => {
  const { API_BASE_URL,loginSuccess, setLoginSuccess, role, responseSubrole } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const { readyForRecruitment, GET_READY_FOR_RECRUITMENT, FetchRecuiter, dataFetched, setDataFetched } = useContext(SponsorContext);
  const [searchStudent, setSearchStudent] = useState("");
  const [technology, setTechnology] = useState("Select Technology");
  const [studentCount, setStudentCount] = useState("");
  const [availableStudent, setAvailableStudent] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const accessToken = localStorage.getItem('accessToken');

  // Fetch recruiter data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "RECRUITER" || role === "ADMIN") && !dataFetched['recruiter']) {
      Promise.all([
        GET_READY_FOR_RECRUITMENT(),
        FetchRecuiter()
      ]).then(() => {
        setDataFetched(prev => ({ ...prev, 'recruiter': true }));
      });
    }
  }, [responseSubrole, role, dataFetched, GET_READY_FOR_RECRUITMENT, FetchRecuiter, setDataFetched]);

   useEffect(() => {
    if (loginSuccess) {
      setShowModal(true);
  
      const timeout = setTimeout(() => {
        setShowModal(false);
        setLoginSuccess(false);
      }, 2000);
  
      return () => clearTimeout(timeout);
    }
  }, [loginSuccess]);


  const handleSponsorClick = () => {
    const studentsSection = document.getElementById("studentsSection");
    if (studentsSection) {
      studentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStudentCountChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      setError("Please enter a valid number.");
      return;
    }
    if (availableStudent !== null && parseInt(value) > availableStudent) {
      setError(`Number of students cannot exceed ${availableStudent}.`);
      return;
    }
    setError("");
    setStudentCount(value);
  };



  const handleRecruitStudent = async (e) => {
    setLoading(true)
    e.preventDefault();
    if (error) return;
  
    const payload = {
      technologies: [technology],
      num_students: parseInt(studentCount),
      remarks: remarks,
    };
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/recruiter/select_students/`,
        JSON.stringify(payload),
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
          },
        }
      );
  
      if (response.status === 200) {
        alert("Students recruited successfully!");
        setTechnology("Select Technology");
        setStudentCount("");
        setRemarks("");
        setAvailableStudent(null);
      }
    } catch (error) {
      console.error("Recruitment error:", error);
      setError("Failed to recruit students. Please try again.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="mt-16">
    <div className="row studentDashboardContainer mx-0">
      <div className="col-xxl-12 col-xl-12 col-md-12 bgSponserDashobard">
        <div className="innerContainerSponsor">
          <img src={bgSponser} className="sponserImgDashboard" />
          <div className="p-3">
            <h1>Ready for Recruitment</h1>
            <p>
              Discover top talent skilled in cutting-edge technologies. Connect
              with students who are ready to contribute to your team and bring
              fresh perspectives to your projects.
            </p>
            <button className="sponserButton" onClick={handleSponsorClick}>
              EXPLORE STUDENTS
            </button>
          </div>
        </div>
      </div>
      <div className="col-xxl-12 col-xl-12 col-md-12">
        <div className="row g-2 sponsorHeader d-none">
          <div className="col-xxl-3 col-xl-3 col-xl-3 d-none">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Student"
                className="search-input mb-0"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-xl-3 ms-auto">
            <div className="dropdown w-100 mb-0">
              <button
                className="btnDropdown dropdown-toggle form-control"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {technology}
              </button>
              <ul className="dropdown-menu w-100">
                {readyForRecruitment.map((tech, index) => (
                  <li
                    className="dropdown-item c-pointer"
                    key={index}
                    onClick={() => setTechnology(tech.technology)}
                  >
                    {tech.technology}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div><br/>
        <h1 className="sponsornowHeading" id="studentsSection">
          Students
        </h1>
        <div className="table-wrapperS">
          <table className="student-tableS">
            <thead className="thead">
              <tr>
                <th className="text-nowrap text-white">Technology</th>
                <th className="text-nowrap text-white">Student Count</th>
              </tr>
            </thead>
            <tbody>
              {readyForRecruitment.length > 0 ? (
                readyForRecruitment.map((tech, index) => (
                  <tr key={index} className="tr">
                    <td className="text-nowrap">{tech.technology}</td>
                    <td className="text-nowrap">{tech.student_count}</td>
                  </tr>
                ))
              ) : (
                <tr className="text-center p-3 w-100">
                  <td colSpan={4}>No Students Found</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="fixedTableBottom">
                <td className="text-end" colSpan={4}>
                  <center>
                  <button
                    type="button"
                    className="btn btn-primary text-nowrap w-40"
                    data-bs-toggle="modal"
                    data-bs-target="#recruitStudentsModal"
                  >
                    Recruit Students
                  </button></center>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div
        className="modal fade"
        id="recruitStudentsModal"
        tabIndex="-1"
        aria-labelledby="recruitStudentsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="recruitStudentsModalLabel">
                Recruit Students
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-2">
                  <label>
                    Select Technology <span className="text-danger">*</span>
                  </label>
                  <div className="dropdown w-100 mb-0">
                    <button
                      className="btnDropdown dropdown-toggle form-control"
                      aria-required
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      
                    >
                      {technology}
                    </button>
                    <ul className="dropdown-menu w-100">
                      {readyForRecruitment.map((tech, index) => (
                        <li
                          className="dropdown-item c-pointer"
                          key={index}
                          onClick={() => {
                            setTechnology(tech.technology);
                            setAvailableStudent(tech.student_count);
                          }}
                        >
                          {tech.technology}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-2">
                  <label>Available Students</label>
                  <input
                    type="text"
                    disabled
                    className="mb-0 fieldDisabled"
                    value={availableStudent}
                  />
                </div>
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-2">
                  <label htmlFor="noOfStudents">
                    Number of Students <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="noOfStudents"
                    placeholder="Enter Number Of Students"
                    required
                    value={studentCount}
                    onChange={handleStudentCountChange}
                    className="mb-0"
                  />
                  {error && <span className="text-danger">{error}</span>}
                </div>
                <div className="col-xxl-12 col-xl-12 col-md-12 mb-2">
                  <label htmlFor="remarks">Add Remarks(Optional)</label>
                  <textarea
                    id="remarks"
                    rows="4"
                    cols="50"
                    placeholder="Enter your remarks here..."
                    className="form-control"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                disabled={!!error}
                onClick={handleRecruitStudent}
              >
                Confirm Recruitment
              </button> */}
              
               <button
              className="btn btn-primary w-full"
              disabled={!!error}
              onClick={handleRecruitStudent}
            >
              {loading ? (
                <>
                  <span
                    className="fas fa-spinner fa-spin me-2"
                  ></span>
                  
                </>
              ) : (
                "Confirm Recruitment"
              )}
            </button>
            
            </div>
          </div>
        </div>
      </div>
    </div>
     {showModal && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Welcome</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          <p>Login successful!</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowModal(false)}
            data-bs-dismiss="modal"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</div>
  );
};

