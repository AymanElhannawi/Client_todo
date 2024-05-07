import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import EditTodo from "./EditTodo";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);
  const [completeTodos, setCompleteTodos] = useState([]);
  const [showComplete, setShowComplete] = useState(false);

  const deleteTodo = async (id, isComplete = false) => {
    try {
      const url = isComplete
        ? `https://todolist-4zb8.onrender.com/complete/${id}`
        : `https://todolist-4zb8.onrender.com/todos/${id}`;
      await axios.delete(url);

      if (isComplete) {
        setCompleteTodos(completeTodos.filter(todo => todo.comp_id !== id));
      } else {
        setTodos(todos.filter(todo => todo.todo_id !== id));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const completeTodo = async id => {
    try {
      await axios.put(`https://todolist-4zb8.onrender.com/todos/complete/${id}`);

      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTodos = async () => {
    try {
      const response = await axios.get("https://todolist-4zb8.onrender.com/todos");
      setTodos(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getCompleteTodos = async () => {
    try {
      const response = await axios.get("https://todolist-4zb8.onrender.com/complete");
      setCompleteTodos(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <Fragment>
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowComplete(!showComplete);
            if (!showComplete) {
              getCompleteTodos();
            }
          }}
        >
          {showComplete ? "Hide Complete" : "Show Complete"}
        </button>
      </div>
      {showComplete && (
        <table className="table mt-5 text-center">
          <thead>
            <tr>
              <th>Description</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {completeTodos.map(todo => (
              <tr key={todo.comp_id}>
                <td>{todo.description}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTodo(todo.comp_id, true)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Complete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo.todo_id}>
              <td>{todo.description}</td>
              <td>
                <EditTodo todo={todo} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.todo_id)}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => completeTodo(todo.todo_id)}
                >
                  Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListTodos;
