# 🧠 CyberTask - Smart Todo Management App

CyberTask is a full-stack, intelligent task management application designed to help users boost productivity using cutting-edge features such as AI-based task prioritization, real-time collaboration, gamification, and modern UI/UX with a dark theme.

## 🚀 Features

- 🔐 **Google OAuth Login** (via NextAuth.js)
- ✅ **CRUD** Task Management
- 🧠 **AI-Based Task Prioritization** using OpenAI
- 🔄 **Real-Time Collaboration** (via Socket.IO)
- 📬 **Task Sharing** with other users
- 🏆 **Gamification**: XP points for completing tasks
- 🔍 **Search & Filter** Tasks
- 💻 **Responsive Dark UI** (Built with TailwindCSS + React)
- 🌐 **Deployed on Vercel & Render**

---

## 🧱 Tech Stack

| Frontend         | Backend            | Database      | Auth         | Realtime       |
|------------------|--------------------|---------------|--------------|----------------|
| React + TypeScript + Tailwind | Node.js + Express | MongoDB Atlas | NextAuth.js    | Socket.IO      |

---

## ⚙️ Project Structure

                      +-----------------------------+
                      |         Web Browser         |
                      |     (React + Tailwind)      |
                      +-------------▲---------------+
                                    |
                              HTTPS Requests
                                    |
                      +-------------|----------------+
                      |     Frontend (Vite React)    |
                      |  - OAuth (Google via NextAuth)|
                      |  - Socket.IO Client           |
                      +-------------|----------------+
                                    |
                              API Requests (REST)
                                    |
                      +-------------▼----------------+
                      |     Backend (Node.js +       |
                      |       Express)               |
                      |  - Auth Routes               |
                      |  - Task Routes               |
                      |  - Socket.IO Server          |
                      |  - AI Integration (OpenAI)   |
                      +-------------|----------------+
                                    |
                         Mongoose (ODM) for MongoDB
                                    |
                      +-------------▼----------------+
                      |        MongoDB Atlas         |
                      |  - Users                     |
                      |  - Tasks                     |
                      |  - XP Points / Gamification  |
                      +-----------------------------+
