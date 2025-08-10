const express = require('express');
const path = require('path');
const scanRoute = require('./routes/scan'); // adjust path if different

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', scanRoute);

// Serve React build files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
