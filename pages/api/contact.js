import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const origin = req.headers.origin;
  if (!origin || new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Invalid origin' });
  const body = req.body;
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid enquiry' });
  const limits = { name: 150, email: 254, company: 200, asset: 100, enquiry: 100, scope: 5000 };
  const fields = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > limit)) return res.status(400).json({ error: 'Invalid enquiry' });
    fields[key] = (body[key] || '').trim();
  }
  if (!fields.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || /[\r\n]/.test(fields.email) || body.consent !== 'on') return res.status(400).json({ error: 'Name, email and consent are required' });
  const { SMTP_HOST, SMTP_PORT = '465', SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO || !CONTACT_FROM) return res.status(503).json({ error: 'Email delivery is not configured' });
  const port = Number(SMTP_PORT);
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465, auth: { user: SMTP_USER, pass: SMTP_PASS }, connectionTimeout: 10000, socketTimeout: 15000 });
  try {
    await transport.sendMail({
      from: CONTACT_FROM, to: CONTACT_TO, replyTo: fields.email,
      subject: 'Mare Custos website enquiry',
      text: Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n\n'),
    });
    return res.status(200).json({ sent: true });
  } catch {
    return res.status(502).json({ error: 'Email could not be delivered' });
  } finally { transport.close(); }
}

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };
