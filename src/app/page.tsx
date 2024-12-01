"use client";
import { useState } from "react";

interface DatasetProfile {
  shape: [number, number];
  missing_values: Record<string, number>;
  data_types: Record<string, string>;
  statistics: Record<string, Record<string, number>>;
  correlation_matrix: Record<string, Record<string, number>>;
}

interface Visualization {
  correlation_heatmap: string;
  [key: string]: string;
}

export default function MLProcess() {
  const [step, setStep] = useState<number>(1); // Track current step
  const [file, setFile] = useState<File | null>(null); // For file upload
  const [selectedDataset, setSelectedDataset] = useState<string>(""); // Selected dataset
  const [datasetTable, setDatasetTable] = useState<any[]>([]); // Dataset table
  const [profile, setProfile] = useState<DatasetProfile | null>(null); // Dataset profile
  const [visualizations, setVisualizations] = useState<Visualization | null>(null); // Dataset visualizations
  const [error, setError] = useState<string | null>(null); // Error handling
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Processing state
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false); // Track upload success
  const [missingValueMethod, setMissingValueMethod] = useState<string>("fill"); // Method to handle missing values
  const [selectedColumn, setSelectedColumn] = useState<string>(""); // Selected column for preprocessing
  const [autoHandled, setAutoHandled] = useState<boolean>(false); // Whether missing values were automatically handled

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Upload dataset to backend
  const uploadDataset = async () => {
    if (!file) {
      setError("Please upload a dataset.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload-dataset", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload dataset");

      const data = await response.json();
      setSelectedDataset(file.name); // Set dataset name after upload
      setError(null); // Clear any previous errors
      setUploadSuccess(true); // Set upload success
    } catch (error) {
      setError("Error uploading dataset");
      console.error("Error uploading dataset", error);
    }
  };

  // Fetch and display the dataset table
  const handleShowDataset = async () => {
    if (!selectedDataset) {
      alert("Please upload a dataset first.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/show-dataset/${selectedDataset}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch dataset");

      const data = await response.json();
      if (data.dataset_preview) {
        setDatasetTable(data.dataset_preview); // Update dataset table state
        setError(null); // Clear any previous errors
      } else {
        setError("No dataset preview available.");
      }
    } catch (error) {
      setError("Error fetching dataset");
      console.error("Error fetching dataset", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyze the dataset
  const handleAnalyze = async () => {
    if (!selectedDataset) {
      alert("Please upload a dataset first.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/analyze-dataset/${selectedDataset}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Failed to analyze dataset");

      const data = await response.json();
      setProfile(data.profile);
      setVisualizations(data.visualizations);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Error analyzing dataset");
      console.error("Error analyzing dataset", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle preprocessing (e.g., missing values, OneHot encoding)
  const handlePreprocessMissingValues = async () => {
    if (!selectedColumn) {
      setError("Please select at least one column for missing value handling.");
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/preprocess-missing-values/${selectedDataset}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method: missingValueMethod,
            column: selectedColumn.split(","), // Split comma-separated columns into an array
          }),
        }
      );
  
      if (!response.ok) throw new Error("Failed to preprocess missing values");
  
      const data = await response.json();
      setError(null); // Clear any previous errors
      alert(data.message); // Show success message
    } catch (error) {
      setError("Error processing missing values");
      console.error("Error processing missing values", error);
    } finally {
      setIsProcessing(false);
    }
  };
  

  // Automatically handle missing values for the entire dataset
  const handleAutoMissingValue = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/auto-handle-missing-values/${selectedDataset}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to auto-handle missing values");

      const data = await response.json();
      setAutoHandled(true);
      setError(null); // Clear any previous errors
      alert(data.message); // Show success message
    } catch (error) {
      setError("Error auto-handling missing values");
      console.error("Error auto-handling missing values", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step navigation buttons
  const handleStepChange = (stepNumber: number) => {
    setStep(stepNumber);
  };

  return (
    <div className="container dark-theme">
      <h1>Machine Learning Process</h1>
      {error && <div className="error">{error}</div>}

      {/* Step Navigation */}
      <div className="steps-nav">
        {[
          "Upload Dataset",
          "Analyze Dataset",
          "Preprocessing",
          "Algorithm Selection",
          "Hyperparameter Tuning",
          "Training & Validation",
        ].map((stepName, index) => (
          <button
            key={index}
            onClick={() => handleStepChange(index + 1)}
            className={`step-button ${step === index + 1 ? "active" : ""}`}
            disabled={step < index + 1} // Disable future steps
          >
            {`Step ${index + 1}: ${stepName}`}
          </button>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div>
          <h2>Step 1: Upload Dataset</h2>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadDataset}>Upload</button>
          {uploadSuccess && (
            <div>
              <p>Dataset uploaded successfully! Proceed to analyze it.</p>
              <button onClick={() => setStep(2)}>Proceed to Analyze Dataset</button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Step 2: Analyze Dataset</h2>
          <button onClick={handleShowDataset} disabled={isProcessing}>
            {isProcessing ? "Fetching Dataset..." : "Show Dataset"}
          </button>
          <button onClick={handleAnalyze} disabled={isProcessing}>
            {isProcessing ? "Analyzing..." : "Analyze Dataset"}
          </button>

          {/* Display Dataset Table */}
          {datasetTable.length > 0 && (
            <div className="dataset-table-container">
              <h3>Dataset Table</h3>
              <table className="dataset-table">
                <thead>
                  <tr>
                    {Object.keys(datasetTable[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datasetTable.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td key={idx}>{value || "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Display Dataset Profile */}
          {profile && (
            <div className="profile-container">
              <h3>Dataset Profile</h3>
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Shape</td>
                    <td>
                      {profile.shape[0]} rows, {profile.shape[1]} columns
                    </td>
                  </tr>
                  <tr>
                    <td>Missing Values</td>
                    <td>
                      <pre>
                        {JSON.stringify(
                          profile.missing_values,
                          null,
                          2
                        ).replace(/null/g, '"N/A"')}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <td>Data Types</td>
                    <td>
                      <pre>
                        {JSON.stringify(profile.data_types, null, 2).replace(
                          /null/g,
                          '"N/A"'
                        )}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <td>Statistics</td>
                    <td>
                      <pre>
                        {JSON.stringify(profile.statistics, null, 2).replace(
                          /null/g,
                          '"N/A"'
                        )}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <td>Correlation Matrix</td>
                    <td>
                      <pre>
                        {JSON.stringify(
                          profile.correlation_matrix,
                          null,
                          2
                        ).replace(/null/g, '"N/A"')}
                      </pre>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Display Visualizations */}
          {visualizations && (
            <div className="visualizations">
              <h3>Visualizations</h3>
              {Object.entries(visualizations).map(([key, url]) => (
                <div key={key}>
                  <h4>{key}</h4>
                  <img
                    src={`http://127.0.0.1:5000/static/${url}`}
                    alt={key}
                    className="visualization-image"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Button to Proceed to Preprocessing */}
          <button
            onClick={() => setStep(3)}
          >
            Proceed to Preprocessing
          </button>
        </div>
      )}

      {/* Step 3: Preprocessing */}
      {step === 3 && (
        <div>
          <h2>Step 3: Preprocessing</h2>

          {/* Handle Missing Values */}
          <h3>Missing Values</h3>
          <select
            onChange={(e) => setMissingValueMethod(e.target.value)}
            value={missingValueMethod}
          >
            <option value="fill">Fill Missing Values</option>
            <option value="drop">Drop Rows with Missing Values</option>
          </select>
          <input
            type="text"
            placeholder="Enter Column Name"
            onChange={(e) => setSelectedColumn(e.target.value)}
          />
          <button onClick={handlePreprocessMissingValues}>
            Apply Preprocessing
          </button>

          {/* Automatically Handle Missing Values */}
          <button onClick={handleAutoMissingValue}>
            Auto Handle Missing Values
          </button>
        </div>
      )}
    </div>
  );
}
