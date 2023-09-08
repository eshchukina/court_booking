import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useMediaQuery } from "react-responsive";

import "./WeatherChart.css";

const WeatherChart = ({ isDarkMode }) => {
  const [weatherData, setWeatherData] = useState([]);
  const isMobile = useMediaQuery({ maxWidth: 750 });
  const isMobileView = useMediaQuery({ maxWidth: 400 });
  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.6423&longitude=41.6339&hourly=temperature_2m,apparent_temperature"
    )
      .then((response) => response.json())
      .then((data) => {
        const temperatureData = data.hourly.temperature_2m;
        const apparentTemperatureData = data.hourly.apparent_temperature;
        const timeData = data.hourly.time;

        const uniqueDates = new Set();

        const formattedData = timeData.map((time, index) => {
          const date = time.split("T")[0];

          uniqueDates.add(date);

          return {
            date,
            temperature_2m: temperatureData[index],
            apparent_temperature: apparentTemperatureData[index],
          };
        });

        setWeatherData(formattedData);
      });
  }, []);

  let chartWidth = 800;
  let chartHeight = 140;

  if (isMobile) {
    chartWidth = 400;
    chartHeight = 130;
  } else if (isMobileView) {
    chartWidth = 200;
    chartHeight = 100;
  }

  return (
    <div className="container">
      <div className={`weather-chart ${isDarkMode ? "dark" : "light"}`}>
        <LineChart width={chartWidth} height={chartHeight} data={weatherData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature_2m"
            name="Temperature (°C)"
            stroke="#b2d957"
          />
          <Line
            type="monotone"
            dataKey="apparent_temperature"
            name="Apparent temperature (°C)"
            stroke="#b3aabd"
          />
        </LineChart>
      </div>
    </div>
  );
};

export default WeatherChart;
