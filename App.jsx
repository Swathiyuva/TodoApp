import { useState, useEffect } from "react";
import confetti from "https://cdn.skypack.dev/canvas-confetti";
import { io } from "socket.io-client";
import axios from "axios";
import "./index.css";

const socket = io("http://localhost:5000");

function App() {
  const [tasks, setTasks] = useState([]);
  const [userToken, setUserToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("username") || "");



  // ✅ Load token from URL or localStorage
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const tokenFromURL = params.get("token");
  const storedToken = localStorage.getItem("token");

  if (tokenFromURL) {
    localStorage.setItem("token", tokenFromURL);
    setUserToken(tokenFromURL);
    window.history.replaceState({}, document.title, "/");
  } else if (storedToken) {
    setUserToken(storedToken); // ✅ reloads token on refresh
  }
}, []);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/"); // force to login if no token
  }
}, []);


useEffect(() => {
  if (userToken) {
    try {
      const payload = JSON.parse(atob(userToken.split(".")[1]));
      setUserEmail(payload.email || "");
      setUserName(payload.name || "User"); // ✅ username
    } catch (err) {
      console.error("Failed to decode token");
    }
  }
}, [userToken]);

useEffect(() => {
  if (userToken) {
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) =>
        console.error("Fetch tasks error:", err.response?.data || err.message)
      );
  }
}, [userToken]);





  // ✅ Real-time listeners
  useEffect(() => {
    const onAdd = (task) => setTasks((prev) => [...prev, task]);
    const onUpdate = (updated) =>
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    const onDelete = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));

    socket.on("task-added", onAdd);
    socket.on("task-updated", onUpdate);
    socket.on("task-deleted", onDelete);

    return () => {
      socket.off("task-added", onAdd);
      socket.off("task-updated", onUpdate);
      socket.off("task-deleted", onDelete);
    };
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    const text = e.target.taskInput.value.trim();
    if (!text || !userToken) return;

    axios
      .post("http://localhost:5000/api/tasks", { text, completed: false }, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then(() => {
        e.target.taskInput.value = "";
      })
      .catch((err) => {
        console.error("➕ Add task error:", err.response?.data || err.message);
      });
  };

const toggleTask = (index) => {
  const updated = { ...tasks[index], completed: !tasks[index].completed };

  axios
    .put(`http://localhost:5000/api/tasks/${updated._id}`, updated, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      // ✅ Update task in frontend immediately
      setTasks((prev) =>
        prev.map((t, i) => (i === index ? res.data : t))
      );
      socket.emit("update-task", res.data);
    })
    .catch((err) => {
      console.error("✅ Toggle error:", err.response?.data || err.message);
    });
};


const deleteTask = (index) => {
  const taskId = tasks[index]._id;

  axios
    .delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then(() => {
      // ✅ Remove task from UI
      setTasks((prev) => prev.filter((_, i) => i !== index));
      socket.emit("delete-task", taskId);
    })
    .catch((err) => {
      console.error("❌ Delete error:", err.response?.data || err.message);
    });
};




const editTask = (index) => {
  const newText = prompt("Edit Task", tasks[index].text);
  if (!newText) return;

  const updated = { ...tasks[index], text: newText };

  axios
    .put(`http://localhost:5000/api/tasks/${updated._id}`, updated, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      // ✅ Update task in frontend
      setTasks((prev) =>
        prev.map((t, i) => (i === index ? res.data : t))
      );
      socket.emit("update-task", res.data);
    })
    .catch((err) => {
      console.error("✏️ Edit error:", err.response?.data || err.message);
    });
};




  const completedCount = tasks.filter((task) => task.completed).length;
  const percent = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  useEffect(() => {
    if (tasks.length && completedCount === tasks.length) {
      confetti({ particleCount: 150, spread: 100 });
    }
  }, [completedCount]);

  return (
    <div className="container">
      {!userToken ? (
        <div style={{ marginBottom: "30px" }}>
          <a href="http://localhost:5000/auth/google">
            <button style={{ padding: "10px 20px", fontSize: "16px" }}>
              Sign in with Google
            </button>
          </a>
        </div>
      ) : (
        <>
          <div className="stats-container">
            <div className="details">
              <h1>TODO APP</h1>
              <p>Welcome {userName}</p>
              <div id="progressBar">
                <div id="progress" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
            <div className="stats-numbers">
              <p id="numbers">{completedCount} / {tasks.length}</p>
            </div>
          </div>

          <form onSubmit={addTask}>
            <input type="text" name="taskInput" placeholder="Write your task" />
            <button type="submit">+</button>
          </form>

          <ul id="task-list">
            {tasks.map((task, index) => (
              <li key={task._id || index}>
                <div className="taskItem">
                  <div className={`task ${task.completed ? "completed" : ""}`}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(index)}
                    />
                    <p>{task.text}</p>
                  </div>
                  <div className="icons">
                    <img src="/img/edit.png" onClick={() => editTask(index)} alt="edit" />
                    <img src="/img/bin.png" onClick={() => deleteTask(index)} alt="delete" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
