import React, { useState } from "react";
import "./App.css";
import ChartDisplay from "./ChartDisplay";

const examples = {
  Square: "list(map(lambda x: x**2, [1, 2, 3, 4]))",
  EvenFilter: "list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))",
  SumReduce: "reduce(lambda x, y: x + y, [10, 20, 30])",
  Fibonacci: "fibonacci(6)",
};

const detectFunctionType = (code) => {
  if (code.includes("map")) return "Map";
  if (code.includes("filter")) return "Filter";
  if (code.includes("reduce")) return "Reduce";
  if (code.includes("fib")) return "Fibonacci";
  return "Other";
};

const isValidPieData = (data) => Array.isArray(data) && data.every(x => typeof x === "number" && x > 0);

function App() {
  const [tab, setTab] = useState("single");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [funcType1, setFuncType1] = useState("");
  const [funcType2, setFuncType2] = useState("");

  const evaluateCode = async (code, setResult, setFuncType) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (
        response.status !== 200 ||
        !data.result ||
        (typeof data.result === "string" && data.result.toLowerCase().includes("error"))
      ) {
        const errorMsg = data.detail || data.result || "Unknown error occurred.";
        setResult(`❌ Error: ${errorMsg}`);
        setFuncType("");
      } else {
        setResult(data.result);
        setFuncType(detectFunctionType(code));
      }
    } catch (err) {
      setResult("❌ Error: Could not connect to backend");
      setFuncType("");
    }
  };

  const handleExample = (e, setter) => {
    setter(examples[e.target.value]);
  };

  return (
    <div className="App">
      <h2>🧠 Functional Programming Playground</h2>

      <div className="tab-buttons">
        <button className={tab === "single" ? "active" : ""} onClick={() => setTab("single")}>Single Mode</button>
        <button className={tab === "compare" ? "active" : ""} onClick={() => setTab("compare")}>Compare Mode</button>
      </div>

      {tab === "single" ? (
        <>
          <div className="dropdown">
            <label>💡 Examples: </label>
            <select onChange={(e) => handleExample(e, setCode1)} defaultValue="">
              <option value="" disabled>Select...</option>
              {Object.keys(examples).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <textarea value={code1} onChange={(e) => setCode1(e.target.value)} placeholder="Enter the function..." rows={6} />
          <button onClick={() => evaluateCode(code1, setResult1, setFuncType1)}>Evaluate</button>

          {result1 && (
            <div className="output">
              <p><strong>Function:</strong> {funcType1 || "Unknown"}</p>
              {typeof result1 === "string" ? (
                <p style={{ color: "red" }}>{result1}</p>
              ) : (
                <>
                  <p><strong>Output:</strong> {JSON.stringify(result1)}</p>
                  <ChartDisplay data={result1} chartType={chartType} />
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="dropdown">
            <label>🧪 Chart Type: </label>
            <select onChange={(e) => setChartType(e.target.value)} value={chartType}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>

          <textarea value={code1} onChange={(e) => setCode1(e.target.value)} placeholder="Enter 1st expression..." rows={5} />
          <textarea value={code2} onChange={(e) => setCode2(e.target.value)} placeholder="Enter 2nd expression..." rows={5} />

          <button onClick={() => {
            evaluateCode(code1, setResult1, setFuncType1);
            evaluateCode(code2, setResult2, setFuncType2);
          }}>Compare</button>

          {result1 && (
            <div className="output">
              <p><strong>Function 1:</strong> {funcType1}</p>
              {typeof result1 === "string" ? (
                <p style={{ color: "red" }}>{result1}</p>
              ) : (
                <>
                  <p><strong>Output 1:</strong> {JSON.stringify(result1)}</p>
                  <ChartDisplay data={result1} chartType={chartType} />
                </>
              )}
            </div>
          )}

          {result2 && (
            <div className="output">
              <p><strong>Function 2:</strong> {funcType2}</p>
              {typeof result2 === "string" ? (
                <p style={{ color: "red" }}>{result2}</p>
              ) : (
                <>
                  <p><strong>Output 2:</strong> {JSON.stringify(result2)}</p>
                  <ChartDisplay data={result2} chartType={chartType} />
                </>
              )}
            </div>
          )}

          {Array.isArray(result1) && Array.isArray(result2) && result1.length === result2.length && (
            <div className="output">
              <p><strong>🔁 Difference Chart:</strong></p>
              {chartType === "pie" && !isValidPieData(result1.map((val, i) => val - result2[i])) ? (
                <p style={{ color: "red" }}>⚠️ Cannot show pie chart for difference (contains negative or zero values).</p>
              ) : (
                <ChartDisplay data={result1.map((val, i) => val - result2[i])} chartType={chartType} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
