import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const toUpperCaseFistLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const PieChart = () => {
  // Dữ liệu danh mục sản phẩm
  const categoryData = [
    { _id: "electronics", count: 364 },
    { _id: "fashion", count: 61 },
    { _id: "beauty", count: 52 },
    { _id: "jewelry", count: 48 },
  ];

  const data = {
    labels: categoryData.map((item) => toUpperCaseFistLetter(item._id)),
    datasets: [
      {
        label: "Category Distribution",
        data: categoryData.map((item) => item.count),
        backgroundColor: ["#10b981", "#f97316", "#3b82f6", "#eab308"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "Arial, sans-serif",
            weight: "bold",
          },
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
