export default async function handler(req, res) {
  // CORS-Header immer setzen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight-Request abfangen
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Kein Text übergeben" });
  }

  // Weiterleitung an deinen LibreTranslate-Server (z. B. lokal oder öffentlich)
    try {const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    return res.status(500).json({ error: "Übersetzung fehlgeschlagen" });
  }

  const data = await response.json();
  res.status(200).json(data);
} catch (error) {
    // Auch hier CORS-Header setzen und Fehler zurückgeben
    return res.status(500).json({ error: "Serverfehler", details: error.message });
  }
}
