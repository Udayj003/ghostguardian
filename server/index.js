const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const footprintRoutes = require('./routes/footprint');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from Vite's build folder (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Basic API routes
app.get('/api', (req, res) => {
  res.send('GhostGuardian backend is running.');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from GhostGuardian backend 👻' });
});

// Footprint scanning routes
app.use('/api/footprint', footprintRoutes);

// ✅ Wildcard route for SPA (catch-all) — fixed syntax for Express
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
