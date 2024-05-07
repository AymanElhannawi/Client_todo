const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todos");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all completed todos
app.get("/complete", async (req, res) => {
  try {
    const allCompleteTodos = await pool.query("SELECT * FROM complete");
    res.json(allCompleteTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todos (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a todo to complete
app.put("/todos/complete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const completeTodo = await pool.query(
      "INSERT INTO complete (comp_id, description) SELECT todo_id, description FROM todos WHERE todo_id = $1 RETURNING *",
      [id]
    );
    await pool.query("DELETE FROM todos WHERE todo_id = $1", [id]);
    res.json("Todo was completed!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todos WHERE todo_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a completed todo
app.delete("/complete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCompleteTodo = await pool.query(
      "DELETE FROM complete WHERE comp_id = $1",
      [id]
    );
    res.json("Completed Todo was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
