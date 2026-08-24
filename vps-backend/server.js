const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;
const DATA_FILE = path.join(__dirname, 'data', 'looks.json');

// Enable CORS for Vercel frontend & JSON body parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper to read looks
function readLooks() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading looks file:', err);
    return [];
  }
}

// Helper to write looks
function writeLooks(looks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(looks, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing looks file:', err);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'STARBOY STREETWEAR VPS API', time: new Date().toISOString() });
});

// GET /api/looks - Fetch all looks
app.get('/api/looks', (req, res) => {
  const looks = readLooks();
  res.json(looks);
});

// POST /api/looks - Save or update a look
app.post('/api/looks', (req, res) => {
  const newLook = req.body;
  if (!newLook || (!newLook.id && !newLook.number)) {
    return res.status(400).json({ error: 'Invalid look data' });
  }

  let looks = readLooks();
  const index = looks.findIndex(l => String(l.id) === String(newLook.id) || String(l.number) === String(newLook.number));

  if (index !== -1) {
    looks[index] = { ...looks[index], ...newLook };
  } else {
    // Add to top of list (latest first)
    looks.unshift(newLook);
  }

  if (writeLooks(looks)) {
    res.status(201).json({ success: true, look: newLook });
  } else {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

// POST /api/looks/sync - Bulk update all looks
app.post('/api/looks/sync', (req, res) => {
  const allLooks = req.body;
  if (!Array.isArray(allLooks)) {
    return res.status(400).json({ error: 'Expected array of looks' });
  }
  if (writeLooks(allLooks)) {
    res.status(200).json({ success: true, count: allLooks.length });
  } else {
    res.status(500).json({ error: 'Failed to sync database' });
  }
});

// DELETE /api/looks/:id - Delete a look by ID or number
app.delete('/api/looks/:id', (req, res) => {
  const { id } = req.params;
  let looks = readLooks();
  const filtered = looks.filter(l => String(l.id) !== String(id) && String(l.number) !== String(id));

  if (writeLooks(filtered)) {
    res.json({ success: true, deletedId: id });
  } else {
    res.status(500).json({ error: 'Failed to delete look from database' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 STARBOY VPS Cloud Database Server running on port ${PORT}`);
});
