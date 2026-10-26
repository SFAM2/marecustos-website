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
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid enquiry' });
  // Silently discard automated submissions that fill the off-screen bot trap.
  if (body.website !== undefined && (typeof body.website !== 'string' || body.website.trim())) {
    return res.status(200).json({ sent: true });
  }
  const limits = { name: 150, email: 254, company: 200, asset: 100, enquiry: 100, scope: 5000 };
  const fields = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > limit)) return res.status(400).json({ error: 'Invalid enquiry' });
    fields[key] = (body[key] || '').trim();
  }
  if (!fields.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || /[\r\n]/.test(fields.email) || body.consent !== 'on') return res.status(400).json({ error: 'Name, email and consent are required' });
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return res.status(503).json({ error: 'Email delivery is not configured' });
  const { TURNSTILE_SECRET, NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_HOSTNAMES = '' } = process.env;
  if (TURNSTILE_SECRET || NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    const hostnames = new Set(TURNSTILE_HOSTNAMES.split(',').map((host) => host.trim()).filter(Boolean));
    const token = body['cf-turnstile-response'];
    if (!TURNSTILE_SECRET || !NEXT_PUBLIC_TURNSTILE_SITE_KEY || hostnames.size === 0) {
      return res.status(503).json({ error: 'Verification is temporarily unavailable. Please email contact@mare-custos.com.' });
    }
    if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
      return res.status(403).json({ error: 'Please complete the security verification and try again.' });
    }
    try {
      const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(10000),
        body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }),
      });
      if (!verification.ok) throw new Error('Verification unavailable');
      const result = await verification.json();
      if (result.success !== true || result.action !== 'contact' || !hostnames.has(result.hostname)) {
        return res.status(403).json({ error: 'Security verification expired or failed. Please try again.' });
      }
    } catch {
      return res.status(403).json({ error: 'Security verification failed. Please try again.' });
    }
  }
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
