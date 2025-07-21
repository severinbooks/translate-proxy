export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST erlaubt" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Kein Text übergeben" });
  }

  // Weiterleitung an deinen LibreTranslate-Server (z. B. lokal oder öffentlich)
  const response = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "en",
      target: "de",
      format: "text"
    })
  });

  if (!response.ok) {
    return res.status(500).json({ error: "Übersetzung fehlgeschlagen" });
  }

  const data = await response.json();
  res.status(200).json(data);
}
