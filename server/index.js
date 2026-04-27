import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize DB with a users array
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Routes
// Get or Create Profile (Syncs frontend state with backend)
app.post('/api/profile', (req, res) => {
  const db = readDB();
  const userData = req.body;
  
  if (!userData.email) return res.status(400).json({ error: 'Email required' });

  let userIndex = db.users.findIndex(u => u.email === userData.email);
  
  if (userIndex > -1) {
    // Update existing user
    db.users[userIndex] = { ...db.users[userIndex], ...userData };
  } else {
    // Register new user
    db.users.push({ ...userData, sessions: [] });
    userIndex = db.users.length - 1;
  }
  
  writeDB(db);
  res.json(db.users[userIndex]);
});

// Get a specific profile by email
app.get('/api/profile', (req, res) => {
  const { email } = req.query;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  res.json(user || null);
});

// Save a session for a specific user
app.post('/api/sessions', (req, res) => {
  const db = readDB();
  const { email, ...sessionData } = req.body;

  if (!email) return res.status(400).json({ error: 'User email required to save session' });

  const userIndex = db.users.findIndex(u => u.email === email);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  const newSession = { id: Date.now(), ...sessionData };
  db.users[userIndex].sessions = db.users[userIndex].sessions || [];
  db.users[userIndex].sessions.push(newSession);
  
  writeDB(db);
  res.json(newSession);
});

// Get sessions for a specific user
app.get('/api/sessions', (req, res) => {
  const { email } = req.query;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  res.json(user ? user.sessions : []);
});

app.listen(PORT, () => {
  console.log(`MindGuard Server running at http://localhost:${PORT}`);
});
