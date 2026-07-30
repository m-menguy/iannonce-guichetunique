const storage = new Map();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { id, data } = req.body;
    
    if (!id || !data) {
      return res.status(400).json({ error: 'Missing id or data' });
    }

    storage.set(id, data);
    
    // Auto-expire après 10 minutes
    setTimeout(() => storage.delete(id), 10 * 60 * 1000);
    
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    const data = storage.get(id);
    
    if (!data) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json(data);
  }

  res.status(405).json({ error: 'Method not allowed' });
}