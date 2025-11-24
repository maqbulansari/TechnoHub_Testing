import React from "react";

export const Testimonials = () => {
  return (
    <div className="col-xxl-12 col-xl-12 col-md-12 px-0 d-none">
      <div className="scrollbar-wrappercenter">
        <div className="row mx-0 flex-nowrap">
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={""} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>Ecomm App {"(Blinkit)"}</h2>

                <p className="card-text">
                  {" "}
                  <span className="fw-bold">Status:</span>Phase two Completed.
                  Phase Three to be Started.
                </p>
                <p className="card-text">
                  {" "}
                  <span className="fw-bold">Technology Stack:</span>Java
                  (Springboot), React Native, React.js and mysql.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={""} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>Ecomm App {"(MHS)"}</h2>

                <p className="card-text">
                  {" "}
                  <span className="fw-bold">Status:</span>Phase-1 (Complete)
                </p>
                <p className="card-text">
                  {" "}
                  <span className="fw-bold">Technology Stack:</span>Backend:
                  Django Rest Framework, Frontend: React Native
                </p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={""} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>Recruiting App{"(SOS)"}</h2>
                <p className="card-text">
                  <span className="fw-bold">Status:</span> Completed (Being
                  enchaced)
                </p>
                <p className="card-text">
                  <span className="fw-bold">Technology Stack:</span>Python and
                  React.js
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
