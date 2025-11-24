import carouselImg1 from "../../assets/images/carousel/carousel1.jpg";
import carouselImg2 from "../../assets/images/carousel/carousel2.jpg";
import carouselImg3 from "../../assets/images/carousel/carousel3.jpg";
import carouselImg4 from "../../assets/images/carousel/carousel4.jpg";
export const Carausel = () => {
  return (
    <div id="carouselExampleCaptions" className="carousel slide">
    <div className="carousel-indicators">
      <button
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide-to="0"
        className="active"
        aria-current="true"
        aria-label="Slide 1"
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide-to="1"
        aria-label="Slide 2"
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide-to="2"
        aria-label="Slide 3"
      ></button>
    </div>
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img
          src={carouselImg1}
          alt="..."
          className="carouselImg d-block w-100"
        />
        {/* <div className="carousel-caption d-none d-md-block">
          <h1 className="mainTitleCarousel">Code Your Future</h1>
          <p>
            Join our web development classes to learn essential coding
            skills, build dynamic websites, and kickstart your tech career.
            Empower yourself with hands-on projects and expert guidance.
          </p>
        </div> */}
      </div>
      <div className="carousel-item">
        <img
          src={carouselImg2}
          alt="..."
          className="carouselImg d-block w-100"
        />
      </div>
      <div className="carousel-item">
        <img
          src={carouselImg3}
          alt="..."
          className="carouselImg d-block w-100"
        />
      </div>
    </div>
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target="#carouselExampleCaptions"
      data-bs-slide="prev"
    >
      <span
        className="carousel-control-prev-icon"
        aria-hidden="true"
      ></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target="#carouselExampleCaptions"
      data-bs-slide="next"
    >
      <span
        className="carousel-control-next-icon"
        aria-hidden="true"
      ></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
  )
}
