import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));

// Schema
const Task = mongoose.model('Task', new mongoose.Schema({
  userId: String,
  text: String,
  completed: Boolean
}));

// API Routes
app.get('/api/tasks/:uid', async (req, res) => {
  const tasks = await Task.find({ userId: req.params.uid });
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = await Task.create(req.body);
  io.emit('task-added', task);
  res.json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  io.emit('task-updated', task);
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  io.emit('task-deleted', req.params.id);
  res.sendStatus(204);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
