export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Kein Text übergeben' });
  }

  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'de',
        format: 'text',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Fehler von LibreTranslate:', errText);
      return res.status(500).json({ error: 'Übersetzung fehlgeschlagen', details: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Serverfehler im Proxy:', error);
    return res.status(500).json({ error: 'Serverfehler', details: error.message });
  }
}
