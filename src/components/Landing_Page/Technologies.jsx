import python from "../../assets/images/coursesLogo/python.png";
import java from "../../assets/images/coursesLogo/java.png";
import mern from "../../assets/images/coursesLogo/mern.webp";
import aiml from "../../assets/images/coursesLogo/aiml.png";


export const Technologies = () => {
  return (
        <div className="col-xxl-12 col-xl-12 col-md-12 px-0"><br/>
          <div className="scrollbar-wrappercenter">
            <div className="row mx-0 flex-nowrap">
              <div className="col-xxl-3 col-xl-3 col-md-3">
                <div className="card">
                  <img src={python} alt="" className="cardImage" />
                  <div className="card-body min-bodyHeight">
                    <h2>Python</h2>
                    <p className="card-text">
                      A versatile programming language that’s easy to learn and
                      widely used in web development, data science, and AI, with
                      a strong library ecosystem.
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Batches:</span>4
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Students:</span>69
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-md-3">
                <div className="card">
                  <img src={java} alt="" className="cardImage" />
                  <div className="card-body min-bodyHeight">
                    <h2>Java</h2>
                    <p className="card-text">
                      A popular, object-oriented language known for its
                      portability and stability, commonly used in enterprise
                      applications and Android development.
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Batches:</span>1
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Students:</span>9
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-md-3">
                <div className="card">
                  <img src={mern} alt="" className="cardImage" />
                  <div className="card-body min-bodyHeight">
                    <h2>MERN</h2>
                    <p className="card-text">
                      A JavaScript-based framework (MongoDB, Express, React,
                      Node.js) that enables full-stack web application
                      development with a unified language across the stack.
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Batches:</span>2
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Students::</span>30
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-md-3">
                <div className="card">
                  <img src={aiml} alt="" className="cardImage" />
                  <div className="card-body min-bodyHeight">
                    <h2>AI/ML</h2>
                    <p className="card-text">
                    Technologies that allow computers to learn and make decisions, transforming industries with applications in predictive analytics, computer vision, and natural language processing.
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Batches:</span>1
                    </p>
                    <p className="card-text">
                      {" "}
                      <span className="fw-bold">Current Students:</span>15
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}
