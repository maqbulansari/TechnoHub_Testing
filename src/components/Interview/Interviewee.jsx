export const Interviewee = () => {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-header applicationHeader txt-white py-3">
                <h2 className="mb-0">
                  Application Submitted
                </h2>
              </div>
              <div className="card-body text-center p-4">
                <h3 className="card-title mb-3">Thank You!</h3>
                <p className="card-text lead">
                  Your application was successfully submitted. You will be contacted soon for an interview.
                </p>
              </div>
              <div className="card-footer bg-light text-muted text-center py-3">
                <small>We appreciate your interest in joining our team</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };