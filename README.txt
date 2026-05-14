====================================================================
                             TASK FORGE
====================================================================

Task Forge is a premium, full-stack project management application
built using the MERN stack. It features a luxury-brutalist, Swiss-
style design system with dynamic typography and deep contrast.

It is designed to help teams organize projects, assign tasks, and 
track progress using a real-time Kanban board interface.

--------------------------------------------------------------------
  FEATURES
--------------------------------------------------------------------
- Full Authentication: Secure JWT-based login and registration.
- Role-Based Access: Admin (create projects, manage members) and 
  Member (view assigned tasks, update status).
- Interactive Kanban Board: Visualize project progress with To Do, 
  In Progress, and Completed columns.
- Cross-Project Task Tracking: The "My Tasks" dashboard allows 
  members to update task statuses concurrently across all projects.
- Luxury Brutalist UI: A typography-first design using Clash Display
  and Satoshi fonts with high-contrast, monochromatic themes.
- Responsive Design: Fully optimized for mobile, tablet, and desktop.
- Monorepo Deployment: A unified Express server serving both the API 
  and the static React frontend.

--------------------------------------------------------------------
  TECH STACK (MERN)
--------------------------------------------------------------------
FRONTEND:
- React 19
- Vite 8
- React Router DOM
- Vanilla CSS (Custom Design System)
- Lucide React (Icons)
- Axios

BACKEND:
- Node.js
- Express.js v5
- MongoDB (Mongoose ODM)
- JSON Web Tokens (JWT)
- bcryptjs (Password Hashing)
- Helmet & CORS

--------------------------------------------------------------------
  LOCAL SETUP INSTRUCTIONS
--------------------------------------------------------------------
1. Clone the repository and navigate to the project directory.

2. Install all dependencies for both frontend and backend:
   npm install

3. Create a ".env" file inside the "backend" directory:
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_key
   PORT=5000

4. Start the development servers:
   - Open terminal 1 (Backend): cd backend && npm run dev
   - Open terminal 2 (Frontend): cd frontend && npm run dev

--------------------------------------------------------------------
  DEPLOYMENT INSTRUCTIONS (RAILWAY)
--------------------------------------------------------------------
This application is configured as a Monorepo for easy deployment 
on platforms like Railway.app.

1. Create a new project on Railway and connect your GitHub repo.
2. In the Railway Variables tab, add:
   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV (set to "production")
3. Railway will automatically detect the root package.json, build 
   the React frontend, and start the Express server.
4. Ensure your MongoDB Atlas Network Access is set to allow 
   connections from anywhere (0.0.0.0/0).

====================================================================
