import { useContext } from "react";
import { AllSaints } from "./centers/AllSaints";
import { LGS } from "./centers/LGS";
import { Mecaps } from "./centers/Mecaps";
import { SponsorContext } from "../../contexts/dashboard/sponsorDashboardContext";

export const Centers = () => {
  const { batchSummary } = useContext(SponsorContext);
  return (
    <div>
      <div className="row flex-nowrap scrollbar-wrappercenter">
        {batchSummary?.map((batchSum) => {
          return (
            <div className="col-xxl-4 col-xl-4 col-md-4" key={batchSum.center}>
              <br></br>
              <div className="card">
                <div className="card-body">
                  <div className="p-4">
                    <h1 className="text-center mb-4 capitalize">{batchSum.center}</h1>
                    <div className="card bg-navyBlue">
                      <div className="card-body">
                        <span className="batchesText">
                          Batches: <span className="numbersContainer">{batchSum.total_batches}</span>
                        </span>
                        <span className="float-end">
                          <i className="fa-solid fa-people-group fa-2xl"></i>
                        </span>
                      </div>
                    </div>
                    <div className="card bg-navyBlue">
                      <div className="card-body">
                        <span className="batchesText">
                          Students: <span className="numbersContainer">{batchSum.total_students}</span>
                        </span>
                        <span className="float-end">
                          <i className="fa-solid fa-graduation-cap fa-2xl"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
