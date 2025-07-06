import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const taskRoutes = (io) => {
  // ✅ GET all tasks for logged-in user
 router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userEmail: req.user.email }); // ✅ This must match JWT payload
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


  // ✅ CREATE a new task
  router.post("/", auth, async (req, res) => {
    const { text } = req.body;
    const userEmail = req.user.email;

    // ✅ Check for missing fields
    if (!text || !userEmail) {
      return res.status(400).json({ error: "Missing task text or user info" });
    }

    try {
      const task = new Task({
        text,
        completed: false,
        userEmail,
      });

      const savedTask = await task.save();

      io.emit("task-added", savedTask); // Real-time
      res.status(201).json(savedTask);
    } catch (err) {
      res.status(500).json({ error: "Failed to add task" });
    }
  });

  // ✅ UPDATE a task
  router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userEmail: req.user.email },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});


  // ✅ DELETE a task
  router.delete("/:id", auth, async (req, res) => {
    try {
      const deleted = await Task.findOneAndDelete({
        _id: req.params.id,
        userEmail: req.user.email,
      });

      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  return router;
};

export default taskRoutes;
