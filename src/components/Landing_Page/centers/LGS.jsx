// import Chart from "react-apexcharts";

// export const LGS = () => {
//   const chartOptions = {
//     chart: {
//       type: "donut",
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           labels: {
//             show: true,
//           },
//         },
//       },
//     },
//     labels: ["Batches", "Students"],
//     colors: ["#66CCFF", "#003366"],
//     legend: {
//       position: "bottom",
//     },
//     dataLabels: {
//       enabled: true,
//     },
//     responsive: [
//       {
//         options: {
//           chart: {
//             width: 300,
//           },
//           legend: {
//             position: "bottom",
//           },
//         },
//       },
//     ],
//   };

//   const chartSeries = [3, 35];

//   return (
//     <div>
//         <h1 className="text-center mb-2">LGS</h1>
//       <Chart options={chartOptions} series={chartSeries} type="donut" />
//     </div>
//   );
// };

export const LGS = () => {
  return (
    <div className="p-4">
      <h1 className="text-center mb-4">LGS</h1>
      <div className="card bg-navyBlue">
        <div className="card-body">
          <span className="batchesText">
            Batches: <span className="numbersContainer">3</span>
          </span>
          <span className="float-end">
            <i class="fa-solid fa-people-group fa-2xl"></i>
          </span>
        </div>

      </div>
      <div className="card bg-navyBlue">
      <div className="card-body">
          <span className="batchesText">
            Students: <span className="numbersContainer">35</span>
          </span>
          <span className="float-end">
          <i class="fa-solid fa-graduation-cap fa-2xl"></i>
          </span>
        </div>
      </div>
    </div>
  );
};
