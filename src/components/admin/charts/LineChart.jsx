// components/LineChart.js
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LineChart = ({lineData}) => {
    const [type, setType] = React.useState("total");
  // Dữ liệu theo yêu cầu
  const chartData = lineData?.salesReport || [
    {
      date: "2025-05-06",
      total: 300,
      order: 1,
    },
    {
      date: "2025-05-11",
      total: 180,
      order: 1,
    },
  ];
  const handleChooseType = (type) => {
    setType(type);
  }
  // Chuẩn bị dữ liệu cho chart.js
  const data = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: type === "total" ? "Sales" : "Orders",
        data: chartData.map((item) => item[type]),
        fill: false,
        borderColor: type === "total" ? "#10b981" : "#f97316",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{ margin: "0", width: "100%", maxWidth: "100%", height: "100%" }}
    >
      <div style={{ display: "flex", justifyContent: "start", gap: "10px" }}>
        <button
          className={`button ${
            type === "total" ? "active-sales" : ""
          }`}
          onClick={() => handleChooseType("total")}
        >
          Sales
        </button>
        <button
          className={`button ${
            type === "total" ? "" : "active-orders"
          }`}
          onClick={() => handleChooseType("order")}
        >
          Orders
        </button>
      </div>
      <hr />
      <div style={{ width: "100%" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
