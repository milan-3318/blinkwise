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

// Initialize DB
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ profile: {}, sessions: [] }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Routes
app.get('/api/profile', (req, res) => {
  const db = readDB();
  res.json(db.profile);
});

app.post('/api/profile', (req, res) => {
  const db = readDB();
  db.profile = { ...db.profile, ...req.body };
  writeDB(db);
  res.json(db.profile);
});

app.get('/api/sessions', (req, res) => {
  const db = readDB();
  res.json(db.sessions);
});

app.post('/api/sessions', (req, res) => {
  const db = readDB();
  const newSession = { id: Date.now(), ...req.body };
  db.sessions.push(newSession);
  writeDB(db);
  res.json(newSession);
});

app.listen(PORT, () => {
  console.log(`MindGuard Server running at http://localhost:${PORT}`);
});
