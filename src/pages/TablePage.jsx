import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../components/Navbar";

const TablePage = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({
    order_id: "",
    region: "",
    branch: "",
    status: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("orderData");
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      fetch("/data/dummy_table_1.csv")
        .then((res) => res.text())
        .then((text) => {
          const result = Papa.parse(text, {
            header: true,
            delimiter: ";",
            skipEmptyLines: true,
            transformHeader: (header) => header.replace(/"/g, "").trim(),
          });
          const rows = result.data.map((row) => {
            const [order_id, region, branch, rawDateString, status] =
              Object.values(row)[0].split(";");
            const dateString = rawDateString.replace(/"/g, "");
            let formattedDate;
            try {
              const [day, month, yearAndTime] = dateString.split("/");
              const [year, time] = yearAndTime.split(" ");
              formattedDate = new Date(`${year}-${month}-${day}T${time}`);
              if (isNaN(formattedDate.getTime())) {
                console.warn(
                  `⚠️ Invalid date encountered: "${dateString}". Skipping record.`
                );
                return;
              }
            } catch (error) {
              console.warn(
                `⚠️ Error parsing date "${dateString}": ${error}. Skipping record.`
              );
              return;
            }
            return {
              order_id,
              region,
              branch,
              date: formattedDate.toISOString().slice(0, 16),
              status: status || "",
            };
          });
          setData(rows);
          localStorage.setItem("orderData", JSON.stringify(rows));
        });
    }
  }, []);

  const handleAdd = () => {
    const newData = [...data, newRow]
    setData(newData);
    localStorage.setItem("orderData", JSON.stringify(newData))
    setNewRow({
      order_id: "",
      region: "",
      branch: "",
      date: "",
      status: "",
    });
  };

  const handleStatusChange = (order_id, newStatus) => {
    console.log(`Updating status for Order ID ${order_id} to "${newStatus}"`);
    const updatedData = data.map((row) =>
      row.order_id === order_id ? { ...row, status: newStatus } : row
    );
    setData(updatedData)
    localStorage.setItem("orderData", JSON.stringify(updatedData))
  };

  const handleDelete = (order_id) => {
    const updatedData = data.filter((row) => row.order_id !== order_id);
    setData(updatedData);
    localStorage.setItem("orderData", JSON.stringify(updatedData));
  };

  const handleChange = (e) => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Order Data Table</h2>
        <div className="mb-6 flex flex-wrap gap-2">
          <input
            name="order_id"
            placeholder="Order Id"
            value={newRow.order_id}
            onChange={handleChange}
          />
          <input
            name="region"
            placeholder="Region"
            value={newRow.region}
            onChange={handleChange}
          />
          <input
            name="branch"
            placeholder="Branch"
            value={newRow.branch}
            onChange={handleChange}
          />
          <input
            name="date"
            type="datetime-local"
            value={newRow.date}
            onChange={handleChange}
          />
          <select
            name="status"
            placeholder="Status"
            value={newRow.status}
            onChange={handleChange}
          >
            <option>Status</option>
            <option>Complete</option>
            <option>Cancel</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Order ID</th>
              <th className="border px-2 py-1">Region</th>
              <th className="border px-2 py-1">Branch</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="text-center border-t">
                <td className="border px-2 py-1">{row.order_id}</td>
                <td className="border px-2 py-1">{row.region}</td>
                <td className="border px-2 py-1">{row.branch}</td>
                <td className="border px-2 py-1">
                  {new Date(row.date).toLocaleString()}
                </td>
                <td className="border px-2 py-1">
                  <select
                    value={row.status}
                    onChange={(e) =>
                      handleStatusChange(row.order_id, e.target.value)
                    }
                  >
                    <option></option>
                    <option>Complete</option>
                    <option>Cancel</option>
                  </select>
                </td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleDelete(row.order_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablePage;
