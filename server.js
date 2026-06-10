'use strict';

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const subscriptions = [];

app.use(express.json());

// POST /api/subscriptions — add a subscription
app.post('/api/subscriptions', (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({ error: 'url is required' });
  }
  const subscription = { url: url.trim() };
  subscriptions.push(subscription);
  return res.status(201).json(subscription);
});

// GET /api/subscriptions — list subscriptions
app.get('/api/subscriptions', (req, res) => {
  return res.json(subscriptions);
});

// Serve static files (after API routes)
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`RSS Feed Reader running at http://localhost:${PORT}`);
});
