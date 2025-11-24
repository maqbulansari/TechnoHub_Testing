// import Chart from "react-apexcharts";

// export const AllSaints = () => {
//   const chartOptions = {
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

//   const chartSeries = [1, 21];
//   return (
//     <div>
//       <div>
//         <h1 className="text-center mb-2">Near All Saints</h1>
//         <Chart options={chartOptions} series={chartSeries} type="donut" />
//       </div>
//     </div>
//   );
// };
export const AllSaints = () => {
  return (
    <div className="p-4">
      <h1 className="text-center mb-4">Near AllSaints</h1>
      <div className="card bg-navyBlue">
        <div className="card-body">
          <span className="batchesText">
            Batches: <span className="numbersContainer">1</span>
          </span>
          <span className="float-end">
            <i class="fa-solid fa-people-group fa-2xl"></i>
          </span>
        </div>

      </div>
      <div className="card bg-navyBlue">
      <div className="card-body">
          <span className="batchesText">
            Students: <span className="numbersContainer">21</span>
          </span>
          <span className="float-end">
          <i class="fa-solid fa-graduation-cap fa-2xl"></i>
          </span>
        </div>
      </div>
    </div>
  );
};
