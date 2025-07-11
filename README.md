# 🧠 Functional Programming Playground

A full-stack web application that allows users to evaluate and visualize functional programming expressions using Python. Built with **React** (frontend) and **FastAPI** (backend), it supports functional concepts like `map`, `filter`, `reduce`, recursion (Fibonacci), and provides visual outputs via bar, line, and pie charts.

## 🔹 Key Features
- Evaluate expressions like `map`, `filter`, `reduce`, `range`, and recursive functions
- Visualize outputs with interactive **Chart.js** graphs
- Supports **error handling** and **difference chart** comparisons
- Built-in dropdown with examples and comparison mode
- Tech Stack: **React**, **FastAPI**, **Chart.js**, **JavaScript**, **Python**

## 🚀 Getting Started

### Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## 🧪 Example Input
```python
list(map(lambda x: x * 2, [1, 2, 3, 4]))
```

## 🔁 Example Output
Bar, Line, and Pie charts showing: `[2, 4, 6, 8]`

---

### 📂 Project Structure
```
functional-programming-playground/
├── backend/
│   └── main.py
├── frontend/
│   ├── package.json
│   └── src/
├── README.md
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).