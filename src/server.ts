import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Stockage temporaire des données
let latestPreviewData: any = null;

// N8N envoie les données ici
app.post('/api/preview', (req, res) => {
  console.log('Données reçues de N8N:', req.body);
  latestPreviewData = req.body;
  res.json({ success: true, message: 'Données reçues' });
});

// React récupère les données ici
app.get('/api/preview', (req, res) => {
  res.json(latestPreviewData);
});

app.listen(PORT, () => {
  console.log(`✅ Backend sur http://localhost:${PORT}`);
});