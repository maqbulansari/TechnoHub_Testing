import { useContext, useEffect, useState } from "react";
import { Footer } from "./Footer";
import { Centers } from "./Centers";
import { Technologies } from "./Technologies";
import { Trainers } from "./Trainers";
import { Projects } from "./Projects";
import { Testimonials } from "./Testimonials";
import { Carausel } from "./Carausel";
import { AuthContext } from "../../contexts/authContext";
export const Landing_page = () => {
  const { loginSuccess, setLoginSuccess,responseSubrole, } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);



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

useEffect(() => {
    if (responseSubrole === "SPONSOR") {
      setShowModal(false);
      setLoginSuccess(false);
    }
    if ( responseSubrole === "STUDENT") {
      setShowModal(false);
      setLoginSuccess(false);
    }
    if ( responseSubrole === "TRAINER") {
      setShowModal(false);
      setLoginSuccess(false);
    }
    
    
    if ( responseSubrole === "RECRUITER") {
      setShowModal(false);
      setLoginSuccess(false);
    }
    if ( responseSubrole === "INTERVIEWEE") {
      setShowModal(false);
      setLoginSuccess(false);
    }

  }, [ responseSubrole,]);



  return (
    <>
        <div>
          <Carausel />
          <div className="row mx-2 my-3">
            <div className="text-primary">
              <hr />
            </div>
            <h1>Our Centers</h1>
            <Centers />
            <div className="text-primary">
              <hr />
            </div>
            <h1>Technologies We Teach</h1>
            <Technologies />
            <div className="text-primary">
              <hr />
            </div>
            <h1>Our Trainers</h1>
            <Trainers />
            <div className="text-primary">
              <hr />
            </div>
            <h1>Our Projects</h1>
            <Projects />
            <div className="text-primary">
              <hr />
            </div>
            <h1 className="d-none">Testimonials</h1>
            <Testimonials />
          </div>
          <Footer />
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
