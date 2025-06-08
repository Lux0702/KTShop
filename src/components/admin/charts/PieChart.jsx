import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const toUpperCaseFirstLetter = (str) => {
  if (!str) return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const PieChart = ({ pieData }) => {
  const categoryData = pieData?.categoryData || [];

  const data = {
    labels: categoryData.map((item) =>
      toUpperCaseFirstLetter(item?.parent || 'Unknown')
    ),
    datasets: [
      {
        label: "Category Distribution",
        data: categoryData.map((item) => item.count),
        backgroundColor: [
          "#10b981", "#f97316", "#3b82f6", "#eab308", "#6366f1", "#ec4899"
        ],
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
