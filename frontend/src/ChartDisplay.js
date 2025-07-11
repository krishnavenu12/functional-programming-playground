import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register required chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Utility: generate distinct colors
const generateColors = (count) => {
  const baseColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#8AFFC1", "#FF9F40",
    "#DDA0DD", "#87CEFA", "#32CD32", "#E6E6FA", "#90EE90"
  ];
  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

// Main component
const ChartDisplay = ({ data, chartType, labels: customLabels, compact = false }) => {
  // Error handling
  if (!Array.isArray(data)) {
    return <p style={{ color: "red" }}>⚠️ Error: Output is not an array. Visualization is only possible for arrays.</p>;
  }
  if (data.length === 0) {
    return <p style={{ color: "red" }}>⚠️ Error: Array is empty.</p>;
  }
  if (data.some(d => typeof d !== "number")) {
    return <p style={{ color: "red" }}>⚠️ Error: Array must contain only numbers.</p>;
  }

  // Generate labels and colors
  const labels = customLabels || data.map((_, i) => `#${i + 1}`);
  const colors = generateColors(data.length);

  // ChartJS data structure
  const chartData = {
    labels,
    datasets: [
      {
        label: "Result",
        data,
        backgroundColor: chartType === "pie" ? colors : "#36A2EB",
        borderColor: "#2b2b2b",
        borderWidth: 1
      }
    ]
  };

  // ChartJS options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: chartType === "pie" },
      title: {
        display: true,
        text: "Output Visualization"
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Value: ${tooltipItem.raw}`
        }
      }
    }
  };

  // Size control
  const chartHeight = compact ? 250 : 400;
  const chartWidth = compact ? 400 : 800;
  const wrapperStyle = {
    maxWidth: compact ? "400px" : "800px",
    maxHeight: compact ? "300px" : "500px",
    margin: "0 auto"
  };

  // Render selected chart type
  return (
    <div style={wrapperStyle}>
      {chartType === "bar" && (
        <Bar data={chartData} options={options} height={chartHeight} width={chartWidth} />
      )}
      {chartType === "line" && (
        <Line data={chartData} options={options} height={chartHeight} width={chartWidth} />
      )}
      {chartType === "pie" && (
        <Pie data={chartData} options={options} height={chartHeight} width={chartWidth} />
      )}
      {!["bar", "line", "pie"].includes(chartType) && (
        <p>⚠️ Unsupported chart type: {chartType}</p>
      )}
    </div>
  );
};

export default ChartDisplay;
