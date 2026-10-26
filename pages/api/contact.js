export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const origin = req.headers.origin;
  try {
    if (!origin || new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Invalid origin' });
  } catch {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  const body = req.body;
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid enquiry' });
  const limits = { name: 150, email: 254, company: 200, asset: 100, enquiry: 100, scope: 5000 };
  const fields = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > limit)) return res.status(400).json({ error: 'Invalid enquiry' });
    fields[key] = (body[key] || '').trim();
  }
  if (!fields.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || /[\r\n]/.test(fields.email) || body.consent !== 'on') return res.status(400).json({ error: 'Name, email and consent are required' });
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return res.status(503).json({ error: 'Email delivery is not configured' });
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'MareCustos/1.0',
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        from: CONTACT_FROM, to: [CONTACT_TO], reply_to: fields.email,
        subject: 'Mare Custos website enquiry',
        text: Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n\n'),
      }),
    });
    if (!response.ok) return res.status(502).json({ error: 'Email could not be delivered' });
    return res.status(200).json({ sent: true });
  } catch {
    return res.status(502).json({ error: 'Email could not be delivered' });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };
