import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { sql, args } = req.body;
  if (!sql) return res.status(400).json({ error: 'Missing sql' });

  try {
    const result = await client.execute({ sql, args: args || [] });
    res.status(200).json({ success: true, rows: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
