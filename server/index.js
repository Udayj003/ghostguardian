// server/index.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON (optional if you need APIs)
app.use(express.json());

// Serve static files from client build folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// Health check route for Render
app.get('/healthz', (req, res) => res.sendStatus(200));

// Your API routes go above this line
// Example:
// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello from server!' });
// });

// Wildcard route to handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
