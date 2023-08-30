import React from "react";
import ReactApexChart from "react-apexcharts";

import "./HeatmapChart.css";

function HeatmapChart({ reservations, courtData, value, index }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create an object to store reservation counts for each date-court combination
  const reservationCounts = {};

  const cellClassName = value !== 0 ? "non-zero-value" : "zero-value";

  const cellColor = value === 0 ? "white" : "red";
  // Populate the reservationCounts object with zeros for all date-court combinations
  courtData.forEach((court) => {
    reservations
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((reservation) => {
        const reservationDate = new Date(reservation.date);
        if (reservationDate >= today) {
          const key = `${reservation.date}_${court.id}`;
          if (!reservationCounts[key]) {
            reservationCounts[key] = {
              courtName: court.name,
              date: reservation.date,
              reservedHours: 0, // Устанавливаем reservedHours по умолчанию равным 0
            };
          }
        }
      });
  });
  
  // Увеличиваем количество броней для каждой актуальной брони
  reservations.forEach((reservation) => {
    const reservationDate = new Date(reservation.date);
    if (reservationDate >= today) {
      const key = `${reservation.date}_${reservation.court_id}`;
      // Проверяем, существует ли ключ в reservationCounts, прежде чем обращаться к reservedHours
      if (reservationCounts[key]) {
        reservationCounts[key].reservedHours += 1;
      }
    }
  });

  
  
  
  
  
  

  // Extract unique dates and court names
  const uniqueDates = [
    ...new Set(Object.values(reservationCounts).map((item) => item.date)),
  ];
  const uniqueCourtNames = [
    ...new Set(Object.values(reservationCounts).map((item) => item.courtName)),
  ];

  // Create the heatmap data in the required format for ApexCharts
  const heatmapData = uniqueCourtNames.map((courtName) => ({
    name: courtName,
    data: uniqueDates.map((date) => {
      const key = `${date}_${
        courtData.find((court) => court.name === courtName).id
      }`;
      return reservationCounts[key]?.reservedHours || 0;
    }),
  }));

  const options = {
    chart: {
      type: "heatmap",

      foreColor: "black", // Set the text color of chart elements
    },
    plotOptions: {
      heatmap: {
        radius: 0, // Set this to 0 to prevent rounded cells
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 1,
              color: "#756685",
            },
            {
              from: 1,
              to: 2,
              color: "#756685",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: uniqueDates,
      labels: {
        show: true,
        rotate: -45,
        formatter: function (value) {
          const date = new Date(value);
          const options = { year: "numeric", month: "2-digit", day: "2-digit" };
          return date.toLocaleDateString("en-US", options);
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
  };

  return (
    <div id="chart" className="chart-container">
      <p className="personalName">Number of booked courts per day:</p>
      <ReactApexChart
        options={options}
        series={heatmapData}
        type="heatmap"
        height={120}
        fill={cellColor}
        className={cellClassName}
        style={{ fill: cellColor }}
      />
    </div>
  );
}

export default HeatmapChart;
