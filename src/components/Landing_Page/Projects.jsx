import ecom from "../../assets/images/projects/ecom.png";
import ecomMHS from "../../assets/images/projects/ecomMHS.jpeg";
import incident from "../../assets/images/projects/incident.png";
import inventory from "../../assets/images/projects/inventory.jpeg";
import invoice from "../../assets/images/projects/invoice.jpeg";
import recuiting from "../../assets/images/projects/recuiting.png";
export const Projects = () => {
  return (
    <div className="col-xxl-12 col-xl-12 col-md-12 px-0"><br/>
      <div className="scrollbar-wrappercenter">
        <div className="row mx-0 flex-nowrap">
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={ecom} alt="" className="cardImage" />
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
              <img src={"ecomMHS"} alt="" className="cardImage" />
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
              <img src={recuiting} alt="" className="cardImage" />
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
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={invoice} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>Astro Qoutation Tool</h2>
                <p className="card-text">
                  <span className="fw-bold">Status:</span> Completed
                </p>
                <p className="card-text">
                  <span className="fw-bold">Technology Stack:</span>Python and
                  React.js
                </p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={incident} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>Invoice Management System</h2>
                <p className="card-text">
                  <span className="fw-bold">Status:</span> Phase-1 (Complete)
                </p>
                <p className="card-text">
                  <span className="fw-bold">Technology Stack:</span>Python and
                  React.js
                </p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={inventory} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>Inventory Management System</h2>
                <p className="card-text">
                  <span className="fw-bold">Status:</span> Phase-1 (Complete)
                </p>
                <p className="card-text">
                  <span className="fw-bold">Technology Stack:</span>Python and
                  React.js
                </p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={recuiting} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>School Management System</h2>
                <p className="card-text">
                  <span className="fw-bold">Status:</span>In-Progress
                </p>
                <p className="card-text">
                  <span className="fw-bold">Technology Stack:</span>To be Added
                </p>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-4 col-md-4">
            <div className="card">
              <img src={""} alt="" className="cardImage" />
              <div className="card-body min-bodyHeight">
                <h2>PMS</h2>
                <p className="card-text">
                  <span className="fw-bold">Status:</span>In-Progress
                </p>
                <p className="card-text">
                  <span className="fw-bold">Technology Stack:</span>Java
                  (Springboot), React.js and mysql
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
