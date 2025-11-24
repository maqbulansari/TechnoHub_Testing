import { useContext, useEffect, useState } from "react";
import bgSponser from "../../assets/images/sponserDashboard/bgSponser.png";
import { Student_Card } from "./Student_Card";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";
import { AuthContext } from "../../contexts/authContext";

export const Students_SponserDashboard = () => {
  const{loginSuccess, setLoginSuccess, role, responseSubrole}=useContext(AuthContext)
  const [showModal, setShowModal] = useState(false);
  const { usersDataToSponsor, batchName, GET_ALL_STUDENTS_TO_SPONSER, GET_BATCH, FetchSponsor, dataFetched, setDataFetched } = useContext(SponsorContext);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("Filter Batch");
  const [selectAll, setSelectAll] = useState(false);

  // Fetch sponsor data when component mounts (only if not already fetched)
  useEffect(() => {
    if ((responseSubrole === "SPONSOR" || role === "ADMIN") && !dataFetched['sponsor']) {
      Promise.all([
        GET_ALL_STUDENTS_TO_SPONSER(),
        GET_BATCH(),
        FetchSponsor()
      ]).then(() => {
        setDataFetched(prev => ({ ...prev, 'sponsor': true }));
      });
    }
  }, [responseSubrole, role, dataFetched, GET_ALL_STUDENTS_TO_SPONSER, GET_BATCH, FetchSponsor, setDataFetched]);

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

  const filterStudent = usersDataToSponsor.filter((student) => {
    const studentName = student.student_name
      ? student.student_name.toLowerCase()
      : "";
    const searchTerm = searchStudent ? searchStudent.toLowerCase() : "";
    const batchName = student.batch_name || "";
    const batchId = student.batch_id ? student.batch_id.toString() : "";
    const selectedBatchTerm = selectedBatch || "";
    const matchesName = studentName.includes(searchTerm);
    const matchesBatch =
      selectedBatchTerm === "Filter Batch" ||
      `${batchName} ${batchId}` === selectedBatchTerm;

    return matchesName && matchesBatch;
  });

  const handleSponsorClick = () => {
    const studentsSection = document.getElementById("studentsSection");
    if (studentsSection) {
      studentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectAll = () => {
    setSelectAll((prev) => !prev);
  };


  return (
    <>
    <div className="row studentDashboardContainer mx-0">
      <div className="col-xxl-12 col-xl-12 col-md-12 bgSponserDashobard">
        <div className="innerContainerSponsor">
          <img src={bgSponser} className="sponserImgDashboard" />
          <div className="p-3">
            <h1>Sponsor Dashboard</h1>
            <p>
              Empower students by providing financial assistance and mentorship.
              Track sponsorship details, student progress, and impact in one
              place.
            </p>
            <button className="sponserButton" onClick={handleSponsorClick}>
              EXPLORE STUDENTS
            </button>
          </div>
        </div>
      </div>
      <div className="col-xxl-12 col-xl-12 col-md-12 ">
        <div className="row g-2 sponsorHeader">
          <div className="col-xxl-2 col-xl-2 col-xl-2">
            <div className="dropdown w-100 mb-0">
              <button
                className="btnDropdown dropdown-toggle form-control bg-primary"

                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Select Students
              </button>
              <ul className="dropdown-menu w-100">
                <li
                  className="dropdown-item c-pointer"
                  onClick={handleSelectAll}
                >

                  {selectAll ? "Deselect All" : "Select All"}
                </li>
              </ul>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-3 col-xl-3">
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
          <div className="col-xxl-3 col-xl-3 col-xl-3  ms-auto">
            <div className="dropdown w-100 mb-0">
              <button
                className="btnDropdown dropdown-toggle form-control"

                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedBatch}
              </button>
              <ul className="dropdown-menu w-100">
                <li
                  className="dropdown-item c-pointer"
                  onClick={() => setSelectedBatch("Filter Batch")}
                >
                  Filter Batch
                </li>

                {batchName.map((batches, index) => (
                  <li
                    className="dropdown-item c-pointer"
                    key={index}
                    onClick={() =>
                      setSelectedBatch(
                        `${batches.batch_name} ${batches.batch_id.toString()}`
                      )
                    }
                  >
                    {batches.batch_name} {batches.batch_id.toString()}

                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
        <h1 className="sponsornowHeading" id="studentsSection">
          Students
        </h1>
        <Student_Card
          filterStudent={filterStudent}
          selectAll={selectAll}
          setSelectAll={setSelectAll}

        />
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
    </>
  );
};
