interface DatasetProfile {
    shape: [number, number];
    missing_values: Record<string, number>;
    data_types: Record<string, string>;
    statistics: Record<string, Record<string, number>>;
    correlation_matrix: Record<string, Record<string, number>>;
  }
  
 interface Visualization {
    correlation_heatmap: string;
    [key: string]: string; // For additional visualizations like distributions
  }
  
 interface PreprocessingLog {
    step: string;
    description: string;
 }

interface PredictionResponse {
    prediction: number[];
  }

interface ModelResults {
   [modelName: string]: {
     accuracy: number;
     model_url: string;
   };
 }
 
