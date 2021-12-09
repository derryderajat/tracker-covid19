import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import numeral from "numeral";
const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0.0");
      },
    },
  },
  scales: {
    xAxis: [
      {
        type: "time",
      },
    ],

    yAxis: {
      gridLines: {
        display: false,
      },
      ticks: {
        callback: function (value, index, values) {
          return numeral(value).format("0 a");
        },
        autoSkip: true,
      },
    },
  },
  plugins: { legend: { display: false } },
};
function LineGraph({ casesType }) {
  const [data, setData] = useState({});
  const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;

    for (let date in data[casesType]) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
        .then((res) => res.json())
        .then((data) => {
          console.log("sesudah", data[casesType]);
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, []);
  return (
    <div>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                label: { casesType },
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#CC1034",
                data: data,
                fill: true,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
