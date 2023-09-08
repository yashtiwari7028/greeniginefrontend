import { Chart } from "chart.js/auto";
import React, { useEffect, useState } from "react";

const PhGraph = () => {
  const [phData, setPhData] = useState([]);
  const [chart, setChart] = useState(null);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const plant = "PlantA";
    const date = "2023-09-02T14:30:00.000Z";

    // Fetch pH data from your backend
    fetch(`/get-phvalues-perhour/${plant}/${date}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPhData(data);
      })
      .catch((error) => {
        console.error("Error fetching pH data:", error);
        setError(error.message); // Set the error state
      });
  }, []); // This empty array means this effect runs only once, when the component mounts

  useEffect(() => {
    if (phData.length > 0) {
      const labels = phData.map((entry) => new Date(entry.date));
      const pHValues = phData.map((entry) => entry.phValue);

      const data = {
        labels: labels,
        datasets: [
          {
            label: "pH Values",
            data: pHValues,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      };

      if (chart) {
        chart.destroy();
      }

      const newChart = new Chart(document.getElementById("myChart"), {
        type: "line",
        data: data,
        options: options,
      });

      setChart(newChart);
    }
  }, [phData, chart]);

  return (
    <div>
      {error ? (
        <div>Error: {error}</div> // Display the error message if an error occurred
      ) : (
        <canvas id="myChart"></canvas>
      )}
    </div>
  );
};

export default PhGraph;
