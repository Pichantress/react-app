import Papa from "papaparse";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [regionFilter, setRegionFilter] = useState("");

  useEffect(() => {
    const getData = localStorage.getItem("orderData")
    if (getData){
        setData(JSON.parse(getData))
    }
  }, []);

  const barData = Object.values(
    data.reduce((acc, row) => {
      if (regionFilter && row.region !== regionFilter) return acc;
      if (!acc[row.branch])
        acc[row.branch] = { branch: row.branch, Complete: 0, Cancel: 0 };
      acc[row.branch][row.status] += 1;
      return acc;
    }, {})
  );

  const lineData = data.reduce((acc, row) => {
    const dateKey = new Date(row.date).toISOString().split("T")[0];
    const key = `${dateKey}`;
    if (!acc[key]) acc[key] = { date: key };
    acc[key][row.region] = (acc[key][row.region] || 0) + 1;
    return acc;
  }, {});
  const lineChartData = Object.values(lineData).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const reqionCounts = data.reduce((acc, row) => {
    acc[row.region] = (acc[row.region] || 0) + 1;
    return acc;
  }, {});

  const donutData = Object.entries(reqionCounts).map(([region, value]) => ({
    name: region,
    value,
  }));

  return (
    <>
    <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard Summary</h2>

        {/* Region Filter */}
        <div className="mb-4">
          <label className="mr-2">Filter by Region:</label>
          <select
            onChange={(e) => setRegionFilter(e.target.value)}
            value={regionFilter}
          >
            <option value="">All</option>
            {[...new Set(data.map((d) => d.region))].map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div>
            <h3 className="font-semibold mb-2">
              Complete vs Cancel per Branch
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Complete" fill="#4CAF50" />
                <Bar dataKey="Cancel" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div>
            <h3 className="font-semibold mb-2">Trend over Time per Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {[...new Set(data.map((d) => d.region))].map((region, i) => (
                  <Line
                    key={region}
                    type="monotone"
                    dataKey={region}
                    stroke={COLORS[i % COLORS.length]}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Total Data per Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {donutData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default DashboardPage