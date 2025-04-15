const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const dbPath = path.join(__dirname, "tasks.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Get tasks for a specific day
app.get("/tasks/:date", (req, res) => {
  const date = req.params.date;
  const tasks = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  res.json(tasks[date] || []);
});

// Add a task to a specific day
app.post("/tasks/:date", (req, res) => {
  const date = req.params.date;
  const task = req.body.task;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const tasks = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  if (!tasks[date]) tasks[date] = [];
  tasks[date].push(task);

  fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2));
  res.status(201).json({ message: "Task added successfully" });
});

// Delete a task from a specific day
app.delete("/tasks/:date/:index", (req, res) => {
  const date = req.params.date;
  const index = parseInt(req.params.index, 10);

  const tasks = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  if (!tasks[date] || !tasks[date][index]) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[date].splice(index, 1);
  fs.writeFileSync(dbPath, JSON.stringify(tasks, null, 2));
  res.status(200).json({ message: "Task deleted successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
