import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// 1️⃣ Define TypeScript types
interface SeriesDataItem {
  seriesId: number;
  fromDateTime: string;
  cost: number;
  qty: number;
}

interface Summary {
  lifetimeAvoidedCost: number;
}

interface ApiResult {
  summary: Summary;
  seriesData: SeriesDataItem[];
}

interface ChartData {
  labels: string[];
  solarOnlyCosts: number[];
  solarBatteryCosts: number[];
  solarOnlyKWh: number;
  solarBatteryKWh: number;
  solarOnlyTotal: number;
  solarBatteryTotal: number;
  solarOnlyRate: number;
  solarBatteryRate: number;
  summary: Summary;
}

export default function StorageAnalysisChart() {
  const [data, setData] = useState<ChartData | null>(null);

  useEffect(() => {
    async function loadReport() {
      const response = await fetch("StorageAnalysis.json");
      const json: { results: ApiResult[] } = await response.json();
      const result = json.results[0];
      const summary = result.summary;

      const seriesData = result.seriesData;
      const solarOnly = seriesData.filter((d) => d.seriesId === 1);
      const solarBattery = seriesData.filter((d) => d.seriesId === 2);

      const labels = solarOnly.map((d) => {
        const date = new Date(d.fromDateTime);
        return `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;
      });

      const solarOnlyCosts = solarOnly.map((d) => d.cost);
      const solarBatteryCosts = solarBattery.map((d) => d.cost);

      const solarOnlyKWh = solarOnly.reduce((sum, d) => sum + d.qty, 0);
      const solarBatteryKWh = solarBattery.reduce((sum, d) => sum + d.qty, 0);
      const solarOnlyTotal = solarOnlyCosts.reduce((a, b) => a + b, 0);
      const solarBatteryTotal = solarBatteryCosts.reduce((a, b) => a + b, 0);

      const solarOnlyRate = solarOnlyTotal / solarOnlyKWh;
      const solarBatteryRate = solarBatteryTotal / solarBatteryKWh;

      setData({
        labels,
        solarOnlyCosts,
        solarBatteryCosts,
        solarOnlyKWh,
        solarBatteryKWh,
        solarOnlyTotal,
        solarBatteryTotal,
        solarOnlyRate,
        solarBatteryRate,
        summary,
      });
    }

    loadReport();
  }, []);

  if (!data) return <p>Loading...</p>;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Solar Only",
        data: data.solarOnlyCosts,
        backgroundColor: "#888",
      },
      {
        label: "Solar + Battery",
        data: data.solarBatteryCosts,
        backgroundColor: "#3ed18c",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "white" },
      },
      x: {
        ticks: {
          color: "white",
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        labels: { color: "white" },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ background: "#222", padding: "2rem", borderRadius: "8px" }}>
      <h2 style={{ color: "white" }}>Storage Analysis</h2>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          marginBottom: "2rem",
          color: "white",
        }}
      >
        <div>
          <h3>Solar Only</h3>
          <p>Cost: ${data.solarOnlyTotal.toFixed(2)}</p>
          <p>
            {data.solarOnlyKWh.toFixed(1)} kWh ·{" "}
            {(data.solarOnlyRate * 100).toFixed(2)} ¢/kWh
          </p>
        </div>

        <div>
          <h3>Solar + Battery</h3>
          <p>Cost: ${data.solarBatteryTotal.toFixed(2)}</p>
          <p>
            {data.solarBatteryKWh.toFixed(1)} kWh ·{" "}
            {(data.solarBatteryRate * 100).toFixed(2)} ¢/kWh
          </p>
        </div>

        <div>
          <h3>Annual Savings</h3>
          <p>${data.summary.lifetimeAvoidedCost.toLocaleString()}</p>
          <p>Savings from utility over lifetime</p>
        </div>
      </div>

      <Bar data={chartData} options={options} />
    </div>
  );
}
