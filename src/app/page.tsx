// Use client for client-side rendering
"use client";
import { useState } from "react";
import { readExcel, processExcel, writeExcel } from "../lib/excelHelper";
import * as XLSX from "xlsx";
import "./globals.css";


export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [processedData, setProcessedData] = useState<Array<any> | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      setFile(files[0]);
      setProcessedData(null); // Reset the processed data on new file upload
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const worksheet = await readExcel(file);
      const data = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON for easy processing
      const processedWorksheet = processExcel(worksheet);
      setProcessedData(data); // Set processed data for display
      const excelBlob = writeExcel(processedWorksheet);
      const url = URL.createObjectURL(excelBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed.xlsx";
      a.click();
    } catch (error) {
      console.error("Error processing the Excel file:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
      <button  onClick={handleUpload} type="button" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Upload and Process</button>
    </div>
  );
}
