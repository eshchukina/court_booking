import React from "react";
import ReactApexChart from "react-apexcharts";

import "./HeatmapChart.css";

function HeatmapChart({ reservations, courtData, value, index, isDarkMode }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reservationCounts = {};

  const cellClassName = value !== 0 ? "non-zero-value" : "zero-value";

  const cellColor = value === 0 ? "white" : "red";

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
              reservedHours: 0,
            };
          }
        }
      });
  });

  reservations.forEach((reservation) => {
    const reservationDate = new Date(reservation.date);
    if (reservationDate >= today) {
      const key = `${reservation.date}_${reservation.court_id}`;

      if (reservationCounts[key]) {
        reservationCounts[key].reservedHours += 1;
      }
    }
  });

  const uniqueDates = [
    ...new Set(Object.values(reservationCounts).map((item) => item.date)),
  ];
  const uniqueCourtNames = [
    ...new Set(Object.values(reservationCounts).map((item) => item.courtName)),
  ];

  const heatmapData = uniqueCourtNames.map((courtName) => ({
    name: courtName,
    data: uniqueDates.map((date) => {
      const key = `${date}_${
        courtData.find((court) => court.name === courtName).id
      }`;
      return reservationCounts[key] &&
        reservationCounts[key].reservedHours !== undefined
        ? reservationCounts[key].reservedHours
        : 0;
    }),
  }));

  const options = {
    chart: {
      type: "heatmap",

      foreColor: "black",
    },
    plotOptions: {
      heatmap: {
        radius: 0,
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
    },
    xaxis: {
      categories: uniqueDates,
      labels: {
        show: true,
        rotate: -45,
        formatter: function(value) {
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
    <div
      id="chart"
      className={`chart-container ${isDarkMode ? "dark" : "light"}`}
    >
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
