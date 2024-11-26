"use client"
import { useState, useEffect } from "react";
interface ModelResults {
    [modelName: string]: number;
  }
export default function Uploads() {
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [targetColumn, setTargetColumn] = useState<string>("");
  const [results, setResults] = useState<ModelResults | null>(null);
  const [error, setError] = useState<string>("");

  // Fetch available datasets from Firebase
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/datasets", {
          method: "GET",
        });
        const data = await response.json();
        setDatasets(data.datasets); // Assuming your backend returns an array of dataset names
      } catch (err) {
        setError("Error fetching datasets");
      }
    };
    fetchDatasets();
  }, []);

  // Fetch the column names of the selected dataset
  const handleSelectDataset = async () => {
    if (!selectedDataset) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/columns/${selectedDataset}`, {
        method: "GET",
      });
      const data = await response.json();
      setColumns(data.columns); // Assuming your backend returns the column names
    } catch (err) {
      setError("Error fetching columns");
    }
  };

  // Handle running the ML pipeline
  const handleRun = async () => {
    setLoading(true);
    setError("");
    setResults(null);

    if (!targetColumn) {
      setError("Please select a target column");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataset: selectedDataset, target_column: targetColumn }),
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      } else {
        setError("Failed to run ML pipeline");
      }
    } catch (err) {
      setError("Error running ML pipeline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Run ML Pipeline</h1>

      {/* Dataset selection */}
      <div className="mb-4">
        <label className="mr-2">Select Dataset:</label>
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">--Select--</option>
          {datasets.map((dataset) => (
            <option key={dataset} value={dataset}>
              {dataset}
            </option>
          ))}
        </select>
        <button onClick={handleSelectDataset} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
          Load Columns
        </button>
      </div>

      {/* Show column dropdown if dataset is selected */}
      {columns.length > 0 && (
        <div className="mb-4">
          <label className="mr-2">Select Target Column:</label>
          <select
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">--Select--</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Run button */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleRun}
        disabled={loading}
      >
        {loading ? "Running..." : "Run"}
      </button>

      {/* Error messages */}
      {error && <div className="mt-4 text-red-500">{error}</div>}

      {/* Results */}
      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-bold text-black shadow-emerald-300">Results:</h2>
          <ul className="text-black">
            {Object.entries(results).map(([model, accuracy]) => (
              <li key={model}>
                {model}: {accuracy.toFixed(4)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
